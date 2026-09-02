# Docs chatbot

Vercel serverless function that answers questions about the docs. The whole
docs corpus (~30k tokens) goes into a cached system prompt — no RAG, no vector
store.

- Endpoint: `https://chatbot-gieworlds-projects.vercel.app/api/chat`
- Widget: `docs/assets/chat.js` (`ENDPOINT` at the top)

## Deploy

```bash
cd chatbot
vercel deploy --prod
```

The API key lives in Vercel env vars, never in the browser:

```bash
vercel env add ANTHROPIC_API_KEY production   # paste at the prompt
vercel deploy --prod                          # env vars apply to new deploys only
```

## Why the region is pinned

`vercel.json` pins the function to `iad1` (US East). This was originally on
Cloudflare Workers, which runs at the edge nearest the visitor — from Asia that
meant Hong Kong, and Anthropic rejects API calls egressing from there with
`403 forbidden` (~8 in 10 requests failed). A fixed region makes egress
predictable.

Deployment Protection must stay **disabled** for this project, or every request
gets a Vercel SSO challenge instead of an answer.

## Why not RAG

The docs are ~100KB. Retrieval infrastructure earns its place when the corpus
doesn't fit in context. This one fits many times over, and prompt caching makes
resending it cheap.

## Cost and limits

Docs prefix cached 1h; each question is roughly a cache read plus a short
answer. Model is `claude-sonnet-5` at low effort. Guards: origin allowlist,
20 req/min per IP (in-memory, per instance), 2000-char message cap, last 10
messages only.
