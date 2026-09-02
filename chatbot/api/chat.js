// Vercel serverless function: proxies docs questions to Claude.
// The API key lives in Vercel env vars — never in the browser.
// Region is pinned in vercel.json so egress is predictable (Cloudflare's
// edge routed Asian visitors through HKG, which Anthropic rejects with 403).

const DOCS_URL = "https://gieworld.github.io/purechain-docs/llms-full.txt";
const ALLOWED_ORIGINS = [
  "https://gieworld.github.io",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
];

let docsCache = null;
let docsCachedAt = 0;
const DOCS_TTL_MS = 3600_000;

async function getDocs() {
  if (docsCache && Date.now() - docsCachedAt < DOCS_TTL_MS) return docsCache;
  const r = await fetch(DOCS_URL);
  if (!r.ok) throw new Error(`docs fetch failed: ${r.status}`);
  docsCache = await r.text();
  docsCachedAt = Date.now();
  return docsCache;
}

// ponytail: in-memory, per-instance. Catches naive abuse, not a distributed
// attacker. Move to Upstash/Vercel KV if the bill ever shows it matters.
const hits = new Map();
function rateLimited(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || now - rec.start > windowMs) { hits.set(ip, { start: now, n: 1 }); return false; }
  rec.n += 1;
  if (hits.size > 5000) hits.clear();   // crude bound on memory
  return rec.n > limit;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (!ALLOWED_ORIGINS.includes(origin)) return res.status(403).send("forbidden origin");

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("method not allowed");

  const ip = (req.headers["x-forwarded-for"] || "anon").split(",")[0].trim();
  if (rateLimited(ip)) {
    return res.status(429).json({ error: "Too many questions — try again shortly." });
  }

  const messages = Array.isArray(req.body?.messages) ? req.body.messages.slice(-10) : null;
  if (!messages?.length) return res.status(400).json({ error: "messages required" });
  for (const m of messages) {
    if (typeof m?.content !== "string" || m.content.length > 2000) {
      return res.status(400).json({ error: "invalid message" });
    }
  }

  try {
    const docs = await getDocs();

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        output_config: { effort: "low" },
        system: [
          {
            type: "text",
            text:
              "You answer questions about PureChain using ONLY the documentation below.\n" +
              "Rules:\n" +
              "- If the docs don't cover it, say so plainly and suggest the closest page. Never invent flags, endpoints, or parameters.\n" +
              "- Be concise: a few sentences, or a short code block. This is a chat widget, not a page.\n" +
              "- Link relevant pages as markdown. URLs end in a trailing slash — strip any index.md or .md suffix.\n" +
              "- Operational warnings in the docs (--txpool.pricelimit 0, relay checks, sequential bring-up) matter — surface them when relevant.\n\n" +
              "=== PURECHAIN DOCUMENTATION ===\n" + docs,
            cache_control: { type: "ephemeral", ttl: "1h" },
          },
        ],
        messages,
      }),
    });

    if (!upstream.ok) {
      console.error("anthropic error", upstream.status, await upstream.text());
      return res.status(502).json({ error: "Upstream error. Try again." });
    }

    const data = await upstream.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return res.status(200).json({ text });
  } catch (err) {
    console.error("handler error", err);
    return res.status(500).json({ error: "Server error. Try again." });
  }
}
