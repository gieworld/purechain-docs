# Docs chatbot

Cloudflare Worker that answers questions about the docs. The whole docs corpus
(~30k tokens) goes into a cached system prompt — no RAG, no vector store.

## Deploy

```bash
npm i -g wrangler
wrangler login
wrangler secret put ANTHROPIC_API_KEY    # paste the key
wrangler deploy
```

Put the deployed URL into `docs/assets/chat.js` (`ENDPOINT`).

## Cost

Docs prefix is cached for 1h. After the first question in a window, each
question is roughly a cache read (~30k tokens at 10% rate) plus a short answer —
about $0.03. The rate limiter caps 20/min per IP.

## Why not RAG

The docs are 97KB. Retrieval infrastructure earns its place when the corpus
doesn't fit in context. This one fits eight times over.
