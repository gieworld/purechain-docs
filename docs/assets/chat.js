// PureChain docs assistant. Backend lives in ../chatbot/.
const ENDPOINT = "https://purechain-docs-chat-gieworlds-projects.vercel.app/api/chat";

(function () {
  if (window.__pcChat) return;
  window.__pcChat = true;

  const REDUCED = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  /* --- markdown ---------------------------------------------------------
     Escapes first, then formats, so model output can never inject HTML.
     Deliberately not marked.js: that needs DOMPurify alongside it to be safe,
     and this covers the subset the assistant actually emits. */
  const esc = (s) =>
    s.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const link = (url, text) =>
    '<a href="' + url + '" target="_blank" rel="noopener">' + text + "</a>";

  // Code spans and links are parked as placeholders before the emphasis pass,
  // so a URL containing * can't be mangled into <em>.
  function inline(s) {
    const held = [];
    const park = (html) => "\u0000" + (held.push(html) - 1) + "\u0000";

    let t = s.replace(/`([^`]+)`/g, (_, code) => park("<code>" + code + "</code>"));
    t = t.replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, (_, text, url) => park(link(url, text)));
    t = t.replace(/https?:\/\/[^\s<)]+/g, (m) => {
      const url = m.replace(/[.,;:!?]+$/, "");        // don't swallow trailing punctuation
      return park(link(url, url)) + m.slice(url.length);
    });
    t = t.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
    // Placeholders nest (a code span inside a link label), so restore until
    // none remain. Bounded in case a held string ever looks like a marker.
    for (let pass = 0; pass < 5 && t.indexOf("\u0000") !== -1; pass++) {
      t = t.replace(/\u0000(\d+)\u0000/g, (_, i) => held[i]);
    }
    return t;
  }

  function md(src) {
    const lines = esc(src).split("\n");
    const out = [];
    let inCode = false, inList = false;
    const closeList = () => { if (inList) { out.push("</ul>"); inList = false; } };

    const cells = (row) => row.trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
    const isRow = (l) => /^\s*\|.*\|\s*$/.test(l);
    const isRule = (l) => /^\s*\|[\s:|-]+\|\s*$/.test(l);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/^\s*```/.test(line)) {
        if (inCode) { out.push("</code></pre>"); inCode = false; }
        else { closeList(); out.push("<pre><code>"); inCode = true; }
        continue;
      }
      if (inCode) { out.push(line + "\n"); continue; }

      // Pipe table: a header row immediately followed by a |---|---| rule.
      if (isRow(line) && isRule(lines[i + 1] || "")) {
        closeList();
        const align = cells(lines[i + 1]).map((s) =>
          /^:.*:$/.test(s) ? ' style="text-align:center"'
            : /:$/.test(s) ? ' style="text-align:right"'
            : "");
        out.push('<div class="pc-table"><table><thead><tr>');
        cells(line).forEach((c, n) => out.push("<th" + (align[n] || "") + ">" + inline(c) + "</th>"));
        out.push("</tr></thead><tbody>");
        i += 2;
        for (; i < lines.length && isRow(lines[i]); i++) {
          out.push("<tr>");
          cells(lines[i]).forEach((c, n) => out.push("<td" + (align[n] || "") + ">" + inline(c) + "</td>"));
          out.push("</tr>");
        }
        i--;
        out.push("</tbody></table></div>");
        continue;
      }

      const li = line.match(/^\s*[-*]\s+(.*)$/);
      if (li) {
        if (!inList) { out.push("<ul>"); inList = true; }
        out.push("<li>" + inline(li[1]) + "</li>");
        continue;
      }
      closeList();
      if (line.trim()) out.push("<p>" + inline(line) + "</p>");
    }
    closeList();
    if (inCode) out.push("</code></pre>");
    return out.join("");
  }
  window.__pcMd = md;   // used by the renderer self-check

  /* --- markup ---------------------------------------------------------- */
  const svg = (paths) =>
    '<svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";

  const ICON_CHAT = '<span class="pc-ico-chat">' +
    svg('<path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 9.9 9.9 0 0 1-2.8-.4L3 21l1.6-4.7A8.2 8.2 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"/>') +
    "</span>";
  const ICON_CLOSE = '<span class="pc-ico-close">' + svg('<path d="M18 6 6 18M6 6l12 12"/>') + "</span>";

  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };

  const btn = el("button", "pc-chat-btn", ICON_CHAT + ICON_CLOSE);
  btn.type = "button";
  btn.setAttribute("aria-label", "Ask about PureChain");
  btn.setAttribute("aria-expanded", "false");

  const panel = el("div", "pc-chat-panel");
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "Ask about PureChain");
  panel.innerHTML =
    '<div class="pc-chat-head"><span>Ask about PureChain</span>' +
    '<button type="button" class="pc-chat-x" aria-label="Close">&times;</button></div>' +
    '<div class="pc-chat-log" aria-live="polite"></div>' +
    '<form class="pc-chat-form">' +
    '<input class="pc-chat-in" maxlength="2000" autocomplete="off" ' +
    'aria-label="Your question" placeholder="Why has my node stopped relaying?">' +
    '<button type="submit" class="pc-chat-send">Ask</button></form>';

  document.body.append(btn, panel);

  const log = panel.querySelector(".pc-chat-log");
  const form = panel.querySelector(".pc-chat-form");
  const input = panel.querySelector(".pc-chat-in");
  const send = panel.querySelector(".pc-chat-send");
  const history = [];
  let busy = false;

  const scroll = () => log.scrollTo({ top: log.scrollHeight, behavior: REDUCED ? "auto" : "smooth" });
  const push = (cls, html) => { const m = el("div", "pc-msg " + cls, html); log.append(m); scroll(); return m; };

  const addUser = (text) => { const m = el("div", "pc-msg pc-user"); m.textContent = text; log.append(m); scroll(); return m; };
  const addBot = (markdown) => push("pc-bot", md(markdown));
  const addTyping = () => push("pc-bot pc-typing", '<span class="pc-dots"><span></span><span></span><span></span></span>');

  // Small utility icons, sized below the chat/close pair.
  const icon = (paths) =>
    '<svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + paths + "</svg>";
  const ICON_COPY = icon('<rect x="9" y="9" width="12" height="12" rx="2"/>' +
    '<path d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"/>');
  const ICON_CHECK = icon('<path d="M20 6 9 17l-5-5"/>');

  // Answers are often something to paste elsewhere, so hand back the original
  // markdown rather than the rendered text.
  function copyButton(raw) {
    const b = el("button", "pc-copy", ICON_COPY);
    b.type = "button";
    const label = (t) => { b.title = t; b.setAttribute("aria-label", t); };
    label("Copy answer");
    let timer;

    b.addEventListener("click", async () => {
      clearTimeout(timer);
      try {
        await navigator.clipboard.writeText(raw);
        b.innerHTML = ICON_CHECK;
        b.className = "pc-copy pc-copied";
        label("Copied");
      } catch {
        b.className = "pc-copy pc-copyfail";
        label("Copy failed — select the text instead");
      }
      timer = setTimeout(() => {
        b.innerHTML = ICON_COPY;
        b.className = "pc-copy";
        label("Copy answer");
      }, 1600);
    });
    return b;
  }

  function toggle(open) {
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close assistant" : "Ask about PureChain");

    if (open) {
      panel.classList.remove("pc-closing");
      panel.hidden = false;
      if (!log.children.length) {
        addBot("Ask about running a node, joining as a validator, or anything else in these docs.");
      }
      input.focus();
      return;
    }

    btn.focus();
    if (REDUCED) { panel.hidden = true; return; }

    // Let the close animation finish before hiding, so it doesn't just vanish.
    panel.classList.add("pc-closing");
    panel.addEventListener("animationend", function done() {
      panel.removeEventListener("animationend", done);
      panel.classList.remove("pc-closing");
      panel.hidden = true;
    }, { once: true });
  }

  btn.addEventListener("click", () => toggle(panel.hidden));
  panel.querySelector(".pc-chat-x").addEventListener("click", () => toggle(false));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !panel.hidden) toggle(false);
  });

  // The API requires the first message to be `user`. history grows by two per
  // exchange but the user turn is pushed before the fetch, so a plain
  // slice(-10) starts on an assistant turn from the sixth question on, and
  // every later request 400s until the page is reloaded.
  function recentTurns() {
    const turns = history.slice(-10);
    while (turns.length && turns[0].role !== "user") turns.shift();
    return turns;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q || busy) return;

    busy = true;
    send.disabled = true;
    input.value = "";
    addUser(q);
    history.push({ role: "user", content: q });
    const pending = addTyping();

    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: recentTurns() }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || `Request failed (${r.status}).`);

      const answer = d.text || "No answer came back. Try rephrasing the question.";
      pending.className = "pc-msg pc-bot pc-settled";
      pending.innerHTML = md(answer);
      pending.append(copyButton(answer));
      if (d.text && d.text.trim()) history.push({ role: "assistant", content: d.text });
    } catch (err) {
      pending.className = "pc-msg pc-bot pc-err";
      pending.textContent = err.message;
      history.pop();
    } finally {
      busy = false;
      send.disabled = false;
      input.focus();
      scroll();
    }
  });
})();
