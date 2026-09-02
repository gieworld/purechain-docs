// Floating docs assistant. Talks to the Cloudflare Worker in ../chatbot/.
const ENDPOINT = "https://chatbot-gieworlds-projects.vercel.app/api/chat";

(function () {
  if (window.__pcChat) return;
  window.__pcChat = true;

  const el = (t, c, h) => { const e = document.createElement(t); if (c) e.className = c; if (h !== undefined) e.innerHTML = h; return e; };

  const btn = el("button", "pc-chat-btn", "&#9993;");
  btn.setAttribute("aria-label", "Ask about PureChain");
  const panel = el("div", "pc-chat-panel");
  panel.hidden = true;
  panel.innerHTML =
    '<div class="pc-chat-head"><span>Ask about PureChain</span><button class="pc-chat-x" aria-label="Close">&times;</button></div>' +
    '<div class="pc-chat-log"></div>' +
    '<form class="pc-chat-form"><input class="pc-chat-in" placeholder="How do I run a validator?" autocomplete="off" maxlength="2000"><button class="pc-chat-send">Send</button></form>';
  document.body.append(btn, panel);

  const log = panel.querySelector(".pc-chat-log");
  const form = panel.querySelector(".pc-chat-form");
  const input = panel.querySelector(".pc-chat-in");
  const history = [];

  const add = (role, text) => {
    const m = el("div", "pc-msg pc-" + role);
    m.textContent = text;
    log.append(m);
    log.scrollTop = log.scrollHeight;
    return m;
  };

  const toggle = (open) => {
    panel.hidden = !open;
    if (open) { input.focus(); if (!log.children.length) add("bot", "Ask me anything about running or using PureChain."); }
  };

  btn.onclick = () => toggle(panel.hidden);
  panel.querySelector(".pc-chat-x").onclick = () => toggle(false);
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) toggle(false); });

  form.onsubmit = async (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    input.value = "";
    add("user", q);
    history.push({ role: "user", content: q });
    const pending = add("bot", "…");

    try {
      const r = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history.slice(-10) }),
      });
      const d = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(d.error || "Request failed");
      pending.textContent = d.text || "(no answer)";
      history.push({ role: "assistant", content: d.text || "" });
    } catch (err) {
      pending.textContent = err.message;
      pending.classList.add("pc-err");
      history.pop();
    }
    log.scrollTop = log.scrollHeight;
  };
})();
