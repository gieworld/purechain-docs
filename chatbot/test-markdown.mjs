// Self-check for the chat widget's markdown renderer.
//   node chatbot/test-markdown.mjs
// Loads docs/assets/chat.js against a stub DOM and asserts on window.__pcMd.
import { readFileSync } from "node:fs";
import assert from "node:assert/strict";

const stubEl = () => ({
  className: "", innerHTML: "", textContent: "", hidden: false, type: "",
  style: {}, classList: { add() {}, remove() {} },
  setAttribute() {}, addEventListener() {}, append() {}, focus() {},
  querySelector: () => stubEl(), children: [],
});
const win = {
  document: { createElement: stubEl, body: { append() {} }, addEventListener() {} },
};
globalThis.window = win;
globalThis.document = win.document;

new Function(readFileSync("docs/assets/chat.js", "utf8"))();
const md = window.__pcMd;
assert.ok(md, "renderer not exposed");

const cases = [
  ["**bold**", "<p><strong>bold</strong></p>"],
  ["`--txpool.pricelimit 0`", "<p><code>--txpool.pricelimit 0</code></p>"],
  ["[Free gas](https://x.dev/a/)", '<p><a href="https://x.dev/a/" target="_blank" rel="noopener">Free gas</a></p>'],
  ["- one\n- two", "<ul><li>one</li><li>two</li></ul>"],
  ["```\ngeth attach\n```", "<pre><code>geth attach\n</code></pre>"],
  ["a\n\nb", "<p>a</p><p>b</p>"],
];
for (const [src, want] of cases) {
  assert.equal(md(src), want, `\n  in:   ${JSON.stringify(src)}\n  got:  ${md(src)}\n  want: ${want}`);
}

// No raw asterisks left behind — the bug this widget shipped with.
assert.ok(!md("**Every** node needs `--flag`").includes("*"), "asterisks leaked into output");

// Escaping: model output must never inject HTML.
assert.ok(md('<img src=x onerror=alert(1)>').includes("&lt;img"), "HTML not escaped");
assert.ok(!md('<script>bad()</script>').includes("<script"), "script tag survived");

// Bare URLs must become clickable too — the model does not always use [](  ) syntax.
const bare = md("See https://gieworld.github.io/purechain-docs/05-reference/peering/ for details.");
assert.ok(bare.includes('<a href="https://gieworld.github.io/purechain-docs/05-reference/peering/"'), "bare URL not linked");
assert.ok(bare.includes('rel="noopener"'), "bare link missing rel=noopener");

// Trailing punctuation stays outside the href.
const dot = md("Read https://example.com/a/.");
assert.ok(dot.includes('href="https://example.com/a/"'), "trailing period swallowed into href");

// A markdown link must not be double-linked by the autolinker.
const once = md("[Peering](https://example.com/p/)");
assert.equal((once.match(/<a /g) || []).length, 1, "link wrapped twice");

// An asterisk inside a URL must not turn into <em>.
assert.ok(!md("https://example.com/a*b*c").includes("<em>"), "URL mangled by emphasis pass");

console.log(`ok — ${cases.length + 8} markdown assertions passed`);
