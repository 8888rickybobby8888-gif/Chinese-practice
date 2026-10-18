// Spaced repetition (Leitner boxes) stored in localStorage.
const KEY = "chinese-practice-v1";
const INTERVALS = [0, 1, 2, 4, 8, 16]; // days per box
const DAY = 864e5;
let save = {};
try { save = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
const persist = () => { try { localStorage.setItem(KEY, JSON.stringify(save)); } catch (e) {} };
const st = w => save[w[0]] || (save[w[0]] = { box: 0, due: 0 });
const $ = s => document.querySelector(s);
const view = $("#view");
const esc = s => s.replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const CKEY = "chinese-practice-custom-v1";
const CUSTOM = "My Words";
let custom = [];
try { custom = JSON.parse(localStorage.getItem(CKEY)) || []; } catch (e) {}
const saveCustom = () => { try { localStorage.setItem(CKEY, JSON.stringify(custom)); } catch (e) {} };
const BASE = WORDS.slice();
function rebuild() {
  WORDS.length = 0;
  WORDS.push(...BASE, ...custom.map(w => [w[0], w[1], w[2], CUSTOM]));
  const cats = [...new Set(WORDS.map(w => w[3]))];
  if (!cats.includes(cat)) cat = "All";
  $("#cat").innerHTML = ["All", ...cats].map(c => `<option${c === cat ? " selected" : ""}>${c}</option>`).join("");
}
let mode = "cards", cat = "All";

function pool() { return WORDS.filter(w => cat === "All" || w[3] === cat); }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.random() * (i + 1) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; }

// ---------- Flashcards ----------
function nextCard() {
  const now = Date.now();
  const p = pool();
  const due = p.filter(w => st(w).due <= now);
  $("#info").textContent = `${due.length} due · ${p.length} total`;
  if (!due.length) {
    view.innerHTML = `<div class="card"><div class="hanzi">🎉</div><div class="eng">All caught up!</div><div class="hint">Nothing due in this topic. Try the quiz or pick another topic.</div></div>`;
    return;
  }
  const w = due[Math.random() * due.length | 0];
  view.innerHTML = `<div class="card flip" id="c"><div class="hanzi">${esc(w[0])}</div><div class="hint">tap to reveal</div></div>
    `;
  $("#c").onclick = () => {
    $("#c").onclick = null;
    $("#c").innerHTML = `<div class="hanzi">${esc(w[0])}</div><div class="pinyin">${esc(w[1])}</div><div class="eng">${esc(w[2])}</div>`;
    view.insertAdjacentHTML("beforeend", `<div class="row"><button class="btn bad" id="no">Again</button><button class="btn good" id="yes">Got it</button></div>`);
    $("#no").onclick = () => grade(w, false);
    $("#yes").onclick = () => grade(w, true);
  };
}
function grade(w, ok) {
  const s = st(w);
  s.box = ok ? Math.min(s.box + 1, INTERVALS.length - 1) : 0;
  s.due = ok ? Date.now() + INTERVALS[s.box] * DAY : Date.now();
  persist(); nextCard();
}

// ---------- Quiz ----------
let score = 0, asked = 0;
function nextQuiz() {
  const p = pool();
  if (p.length < 4) { view.innerHTML = `<div class="card"><div class="eng">Pick a bigger topic (need 4+ words).</div></div>`; return; }
  const w = p[Math.random() * p.length | 0];
  const toEng = Math.random() < 0.5;
  const wrong = shuffle(WORDS.filter(x => x !== w && (x[3] === w[3] || p.length < 8))).slice(0, 3);
  const opts = shuffle([w, ...wrong]);
  $("#info").textContent = `Score ${score}/${asked}`;
  view.innerHTML = `<div class="card"><div class="${toEng ? "hanzi" : "eng"}">${esc(toEng ? w[0] : w[2])}</div>${toEng ? `<div class="hint">What does it mean?</div>` : `<div class="hint">Which is the Chinese?</div>`}</div>
    <div class="opts">${opts.map((o, i) => `<button data-i="${i}">${toEng ? esc(o[2]) : esc(o[0]) + " &nbsp;<small>" + esc(o[1]) + "</small>"}</button>`).join("")}</div>`;
  view.querySelectorAll(".opts button").forEach(b => b.onclick = () => {
    const o = opts[+b.dataset.i], ok = o === w;
    asked++; if (ok) score++;
    const s = st(w);
    s.box = ok ? Math.min(s.box + 1, INTERVALS.length - 1) : 0; s.due = ok ? Date.now() + INTERVALS[s.box] * DAY : Date.now();
    persist();
    view.querySelectorAll(".opts button").forEach((x, i) => { x.disabled = true; if (opts[i] === w) x.classList.add("right"); });
    if (!ok) b.classList.add("wrong");
    $("#info").textContent = `Score ${score}/${asked}`;
    view.insertAdjacentHTML("beforeend", `<div class="row"><div class="pinyin">${esc(w[0])} · ${esc(w[1])} · ${esc(w[2])}</div></div><div class="row"><button class="btn primary" id="n">Next</button></div>`);
    $("#n").onclick = nextQuiz;
  });
}

// ---------- My words ----------
function myWords() {
  $("#info").textContent = `${custom.length} of your own`;
  view.innerHTML = `<form id="f" class="opts">
      <input id="h" placeholder="Chinese (e.g. 猫)" required>
      <input id="p" placeholder="Pinyin (e.g. māo)">
      <input id="e" placeholder="English (e.g. cat)" required>
      <button class="btn primary" style="text-align:center">Add word</button>
    </form>
    <details style="margin-top:14px"><summary class="hint">Add many at once</summary>
      <textarea id="bulk" rows="5" placeholder="One per line: 猫, māo, cat"></textarea>
      <div class="row"><button class="btn" id="addbulk">Add all</button></div>
    </details>
    <div id="list">${custom.map((w, i) => `<div class="item"><span class="hz">${esc(w[0])}</span><span>${esc(w[1])}</span><span>${esc(w[2])}</span><button data-d="${i}" title="Delete">✕</button></div>`).join("") || `<p class="hint">No words yet. Add your first one above.</p>`}</div>`;
  $("#f").onsubmit = e => {
    e.preventDefault();
    custom.push([$("#h").value.trim(), $("#p").value.trim(), $("#e").value.trim()]);
    saveCustom(); rebuild(); myWords(); $("#h").focus();
  };
  $("#addbulk").onclick = () => {
    $("#bulk").value.split("\n").forEach(l => {
      const p = l.split(/[,，\t]/).map(x => x.trim());
      if (p.length >= 3 && p[0] && p[2]) custom.push([p[0], p[1], p.slice(2).join(", ")]);
    });
    saveCustom(); rebuild(); myWords();
  };
  view.querySelectorAll("[data-d]").forEach(b => b.onclick = () => {
    const w = custom.splice(+b.dataset.d, 1)[0];
    delete save[w[0]]; persist(); saveCustom(); rebuild(); myWords();
  });
}

// ---------- Progress ----------
function progress() {
  const p = pool();
  const learned = p.filter(w => st(w).box >= 3).length;
  const seen = p.filter(w => st(w).box >= 1).length;
  $("#info").textContent = "";
  const cats = [...new Set(WORDS.map(w => w[3]))];
  const bars = cats.map(c => {
    const ws = WORDS.filter(w => w[3] === c), n = ws.filter(w => st(w).box >= 3).length;
    return `<div><span style="width:90px">${c}</span><span class="track"><i style="width:${n / ws.length * 100}%"></i></span><span>${n}/${ws.length}</span></div>`;
  }).join("");
  view.innerHTML = `<div class="stats"><div class="stat"><b>${p.length}</b>words</div><div class="stat"><b>${seen}</b>started</div><div class="stat"><b>${learned}</b>learned</div></div>
    <div class="bars">${bars}</div><div class="row"><button class="btn" id="reset">Reset progress</button></div>
    <p class="hint">"Learned" = answered correctly 3+ times in a row. Progress is saved in this browser.</p>`;
  $("#reset").onclick = () => { if (confirm("Reset all progress?")) { save = {}; persist(); progress(); } };
}

function render() {
  ({ cards: nextCard, quiz: nextQuiz, words: myWords, progress })[mode]();
}

rebuild();
$("#cat").onchange = e => { cat = e.target.value; render(); };
$("#nav").onclick = e => {
  const b = e.target.closest("button"); if (!b) return;
  mode = b.dataset.m;
  document.querySelectorAll("nav button").forEach(x => x.classList.toggle("on", x === b));
  render();
};
render();
