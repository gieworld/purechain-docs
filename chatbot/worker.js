// Cloudflare Worker: proxies docs questions to Claude.
// The API key lives here as a secret — never in the browser.
// Docs come from the published llms-full.txt, so they update on every docs deploy.

const DOCS_URL = "https://gieworld.github.io/purechain-docs/llms-full.txt";
const ALLOWED_ORIGINS = [
  "https://gieworld.github.io",
  "http://127.0.0.1:8000",
  "http://localhost:8000",
];

let docsCache = null;      // module-global: survives between requests on a warm isolate
let docsCachedAt = 0;
const DOCS_TTL_MS = 3600_000;

async function getDocs() {
  if (docsCache && Date.now() - docsCachedAt < DOCS_TTL_MS) return docsCache;
  const r = await fetch(DOCS_URL, { cf: { cacheTtl: 3600 } });
  if (!r.ok) throw new Error(`docs fetch failed: ${r.status}`);
  docsCache = await r.text();
  docsCachedAt = Date.now();
  return docsCache;
}

const cors = (origin) => ({
  "Access-Control-Allow-Origin": origin,
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
});

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response("forbidden origin", { status: 403 });
    }
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors(origin) });
    }
    if (request.method !== "POST") {
      return new Response("method not allowed", { status: 405, headers: cors(origin) });
    }

    // Abuse guard: public endpoint spending real money.
    const ip = request.headers.get("CF-Connecting-IP") || "anon";
    const { success } = await env.RATE_LIMITER.limit({ key: ip });
    if (!success) {
      return new Response(JSON.stringify({ error: "Too many questions — try again shortly." }),
        { status: 429, headers: { ...cors(origin), "Content-Type": "application/json" } });
    }

    let body;
    try { body = await request.json(); } catch { return new Response("bad json", { status: 400, headers: cors(origin) }); }

    const messages = Array.isArray(body.messages) ? body.messages.slice(-10) : null;
    if (!messages?.length) {
      return new Response("messages required", { status: 400, headers: cors(origin) });
    }
    for (const m of messages) {
      if (typeof m?.content !== "string" || m.content.length > 2000) {
        return new Response("invalid message", { status: 400, headers: cors(origin) });
      }
    }

    const docs = await getDocs();

    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-opus-5",
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
              "- Link relevant pages as markdown when useful.\n" +
              "- Operational warnings in the docs (--txpool.pricelimit 0, relay checks, sequential bring-up) matter — surface them when relevant.\n\n" +
              "=== PURECHAIN DOCUMENTATION ===\n" + docs,
            cache_control: { type: "ephemeral", ttl: "1h" },
          },
        ],
        messages,
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("anthropic error", res.status, detail);
      return new Response(JSON.stringify({ error: "Upstream error. Try again." }),
        { status: 502, headers: { ...cors(origin), "Content-Type": "application/json" } });
    }

    const data = await res.json();
    const text = (data.content || []).filter(b => b.type === "text").map(b => b.text).join("");
    return new Response(JSON.stringify({ text }), {
      headers: { ...cors(origin), "Content-Type": "application/json" },
    });
  },
};
