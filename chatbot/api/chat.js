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

const DOCS_TTL_MS = 3600_000;
const DOCS_FETCH_MS = 10_000;
const UPSTREAM_MS = 60_000;

let docsCache = null;
let docsCachedAt = 0;

async function getDocs() {
  if (docsCache && Date.now() - docsCachedAt < DOCS_TTL_MS) return docsCache;
  try {
    const r = await fetch(DOCS_URL, { signal: AbortSignal.timeout(DOCS_FETCH_MS) });
    if (!r.ok) throw new Error(`docs fetch failed: ${r.status}`);
    docsCache = await r.text();
    docsCachedAt = Date.now();
  } catch (err) {
    // A Pages blip shouldn't take the bot down — hour-old docs beat no docs.
    if (!docsCache) throw err;
    console.warn("docs refresh failed, serving stale copy:", err.message);
    docsCachedAt = Date.now();
  }
  return docsCache;
}

// ponytail: in-memory, per-instance. Catches naive abuse, not a distributed
// attacker. Move to Upstash/Vercel KV if the bill ever shows it matters.
const hits = new Map();

function clientIp(req) {
  // The *leftmost* x-forwarded-for entry is client-supplied and trivially
  // forged, which would hand an attacker a fresh bucket per request.
  // Vercel sets x-real-ip; fall back to the last (nearest-proxy) XFF hop.
  const real = req.headers["x-real-ip"];
  if (real) return String(real).trim();
  const fwd = req.headers["x-forwarded-for"];
  if (!fwd) return "anon";
  const hops = String(fwd).split(",");
  return hops[hops.length - 1].trim() || "anon";
}

function rateLimited(ip, limit = 20, windowMs = 60_000) {
  const now = Date.now();

  if (hits.size > 5000) {
    for (const [k, v] of hits) if (now - v.start > windowMs) hits.delete(k);
    if (hits.size > 5000) return true;   // under flood: shed rather than forget
  }

  const rec = hits.get(ip);
  if (!rec || now - rec.start > windowMs) {
    hits.set(ip, { start: now, n: 1 });
    return false;
  }
  rec.n += 1;
  return rec.n > limit;
}

// The API requires the first message to be `user`, rejects empty content, and
// only knows user/assistant. Repaired here so a stale client can't wedge itself.
function normalize(raw) {
  if (!Array.isArray(raw)) return null;
  const clean = raw
    .filter((m) => m && (m.role === "user" || m.role === "assistant"))
    .filter((m) => typeof m.content === "string" && m.content.trim())
    .map((m) => ({ role: m.role, content: m.content.slice(0, 2000) }));

  const trimmed = clean.slice(-10);
  while (trimmed.length && trimmed[0].role !== "user") trimmed.shift();
  return trimmed.length ? trimmed : null;
}

export default async function handler(req, res) {
  const origin = req.headers.origin || "";
  if (!ALLOWED_ORIGINS.includes(origin)) return res.status(403).send("forbidden origin");

  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Vary", "Origin");
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST") return res.status(405).send("method not allowed");

  if (rateLimited(clientIp(req))) {
    return res.status(429).json({ error: "Too many questions — try again shortly." });
  }

  const messages = normalize(req.body?.messages);
  if (!messages) return res.status(400).json({ error: "messages required" });

  try {
    const docs = await getDocs();

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      signal: AbortSignal.timeout(UPSTREAM_MS),
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-5",
        // Thinking is on by default on Sonnet 5 and draws from max_tokens while
        // being invisible in the response, so leave headroom or answers get
        // truncated mid-command.
        max_tokens: 4096,
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
    let text = (data.content || []).filter((b) => b.type === "text").map((b) => b.text).join("");

    if (data.stop_reason === "max_tokens") {
      text += text ? "\n\n*(answer cut short — ask for a specific part)*" : "";
    }
    if (!text.trim()) {
      // Never return empty: the client would store a blank turn and every
      // later request would be rejected.
      text = "No answer came back. Try rephrasing the question.";
    }

    return res.status(200).json({ text });
  } catch (err) {
    console.error("handler error", err);
    const timedOut = err.name === "TimeoutError" || err.name === "AbortError";
    return res.status(timedOut ? 504 : 500).json({
      error: timedOut ? "That took too long. Try a narrower question." : "Server error. Try again.",
    });
  }
}
