// Shared by the app, login and dashboard pages: profiles, per-profile storage,
// settings, activity log and the optional webhook.
// A "login" is just a profile name stored in this browser; it is not secure.
const CP = (() => {
  const get = k => { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } };
  const set = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} };
  const user = () => { try { return localStorage.getItem("cp:user"); } catch (e) { return null; } };
  const users = () => get("cp:users") || [];
  const key = (n, u = user()) => `cp:${u}:${n}`;
  const read = (n, u) => get(key(n, u));
  const write = (n, v) => set(key(n), v);
  const DEFAULTS = { hidePinyin: false, webhook: "", qTypes: { mc: true, meaning: true, pinyin: true, chars: false } };
  const settings = u => Object.assign({}, DEFAULTS, read("settings", u));

  function login(name) {
    name = name.trim().slice(0, 30);
    if (!name) return false;
    const first = !users().length;
    if (!users().includes(name)) set("cp:users", [...users(), name]);
    if (first) { // bring over data saved before profiles existed
      [["chinese-practice-v1", "progress"], ["chinese-practice-custom-v1", "custom"], ["chinese-practice-unit-v1", "unit"]]
        .forEach(([old, n]) => { const v = get(old); if (v != null) set(key(n, name), v); });
    }
    try { localStorage.setItem("cp:user", name); } catch (e) { return false; }
    send("login", {});
    return true;
  }
  function logout() { try { localStorage.removeItem("cp:user"); } catch (e) {} location.href = "login.html"; }
  function require() { if (!user()) { location.replace("login.html"); return false; } return true; }

  function send(event, extra) {
    const url = settings().webhook;
    if (!/^https?:\/\//i.test(url)) return;
    const ev = read("events") || [];
    const body = JSON.stringify(Object.assign({
      event, user: user(), time: new Date().toISOString(),
      stats: { answered: ev.length, correct: ev.filter(e => e.ok).length },
    }, extra));
    // text/plain + no-cors avoids a CORS preflight, so any webhook URL can receive it.
    try { fetch(url, { method: "POST", mode: "no-cors", keepalive: true, headers: { "Content-Type": "text/plain" }, body }).catch(() => {}); } catch (e) {}
  }
  function track(w, ok, source) {
    const ev = read("events") || [];
    ev.push({ t: Date.now(), w: w[0], ok: !!ok });
    write("events", ev.slice(-1000));
    send("answer", { source, correct: !!ok, word: { hanzi: w[0], pinyin: w[1], english: w[2] } });
  }
  return { user, users, read, write, settings, login, logout, require, send, track };
})();
