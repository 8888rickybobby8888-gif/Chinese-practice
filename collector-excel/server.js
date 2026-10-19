// Receives webhooks from the practice site, appends them to events.xlsx (real Excel
// file next to this script) and serves a dashboard. Run with: npm install && npm start
const http = require("http");
const fs = require("fs");
const path = require("path");
const ExcelJS = require("exceljs");

const PORT = process.env.PORT || 3000;
const SECRET = process.env.SECRET || ""; // optional; if set, requests need ?key=SECRET
const FILE = path.join(process.env.DATA_DIR || __dirname, "events.xlsx");
const HEADERS = ["time", "user", "event", "source", "hanzi", "pinyin", "english", "correct", "total_answered", "total_correct"];

let wb, ws;
const events = []; // same rows, kept in memory for the dashboard

async function load() {
  wb = new ExcelJS.Workbook();
  if (fs.existsSync(FILE)) {
    await wb.xlsx.readFile(FILE);
    ws = wb.getWorksheet("Events");
    ws.eachRow((row, n) => { if (n > 1) events.push(row.values.slice(1)); });
  }
  if (!ws) {
    ws = wb.addWorksheet("Events");
    ws.addRow(HEADERS).font = { bold: true };
    ws.views = [{ state: "frozen", ySplit: 1 }];
    ws.columns.forEach((c, i) => c.width = [24, 14, 10, 12, 14, 16, 22, 9, 14, 13][i]);
    await wb.xlsx.writeFile(FILE);
  }
}

// Saves are queued so two quick webhooks never write the file at the same time.
let queue = Promise.resolve();
function addRow(row) {
  events.push(row);
  ws.addRow(row);
  queue = queue.then(() => wb.xlsx.writeFile(FILE)).catch(e => console.error("save failed:", e.message));
  return queue;
}

function stats() {
  const users = {};
  for (const [time, user, event, , hanzi, pinyin, english, correct] of events) {
    if (!user) continue;
    const u = users[user] || (users[user] = { user, answered: 0, correct: 0, last: "", perDay: {}, missed: {}, recent: [] });
    const t = String(time);
    if (!u.last || t > u.last) u.last = t;
    if (event !== "answer") continue;
    u.answered++;
    const ok = Number(correct) === 1;
    if (ok) u.correct++;
    else { const k = [hanzi, pinyin, english].join("|"); u.missed[k] = (u.missed[k] || 0) + 1; }
    const d = new Date(t);
    if (!isNaN(d)) { const k = d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); u.perDay[k] = (u.perDay[k] || 0) + 1; }
    u.recent.push({ time: t, hanzi, english, ok });
  }
  return Object.values(users).map(u => ({
    user: u.user, answered: u.answered, correct: u.correct, last: u.last, perDay: u.perDay,
    missed: Object.entries(u.missed).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => ({ word: k.split("|"), n })),
    recent: u.recent.slice(-10).reverse(),
  })).sort((a, b) => b.last.localeCompare(a.last));
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, "http://x");
  const cors = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "*" };
  if (req.method === "OPTIONS") { res.writeHead(204, cors); return res.end(); }
  if (SECRET && url.searchParams.get("key") !== SECRET) { res.writeHead(403, cors); return res.end("forbidden"); }

  if (req.method === "POST" && url.pathname === "/hook") {
    let body = "";
    req.on("data", c => { body += c; if (body.length > 1e5) req.destroy(); });
    req.on("end", async () => {
      let d;
      try { d = JSON.parse(body); } catch (e) { res.writeHead(400, cors); return res.end("bad json"); }
      const w = d.word || {}, s = d.stats || {};
      await addRow([d.time || new Date().toISOString(), d.user || "", d.event || "", d.source || "",
        w.hanzi || "", w.pinyin || "", w.english || "",
        d.event === "answer" ? (d.correct ? 1 : 0) : "", s.answered || 0, s.correct || 0]);
      res.writeHead(200, cors); res.end("ok");
    });
  } else if (url.pathname === "/api/stats") {
    res.writeHead(200, { ...cors, "Content-Type": "application/json" }); res.end(JSON.stringify(stats()));
  } else if (url.pathname === "/events.xlsx") {
    queue.then(() => {
      res.writeHead(200, { ...cors, "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=events.xlsx" });
      fs.createReadStream(FILE).pipe(res);
    });
  } else if (url.pathname === "/") {
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(fs.readFileSync(path.join(__dirname, "index.html")));
  } else { res.writeHead(404, cors); res.end("not found"); }
});

load().then(() => server.listen(PORT, () => {
  console.log(`Collector running.\n  Webhook URL : http://localhost:${PORT}/hook${SECRET ? "?key=" + SECRET : ""}\n  Dashboard   : http://localhost:${PORT}/${SECRET ? "?key=" + SECRET : ""}\n  Excel file  : ${FILE}`);
}));
