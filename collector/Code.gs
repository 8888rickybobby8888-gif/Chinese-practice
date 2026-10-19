// Webhook collector + dashboard for Chinese Practice, as a Google Apps Script web app.
// Every answer/login the practice site sends is appended as a row in the "Events"
// sheet of the spreadsheet this script is attached to (download it as .xlsx any time).

const SECRET = "change-me"; // put the same value in the webhook URL as ?key=... ("" = no check)
const SHEET = "Events";
const HEADERS = ["time", "user", "event", "source", "hanzi", "pinyin", "english", "correct", "total_answered", "total_correct"];

function sheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(SHEET);
  if (!sh) {
    sh = ss.insertSheet(SHEET);
    sh.appendRow(HEADERS);
    sh.setFrozenRows(1);
  }
  return sh;
}

function allowed_(key) { return !SECRET || key === SECRET; }

// The practice site POSTs JSON here (sent as text/plain).
function doPost(e) {
  if (!allowed_(e.parameter && e.parameter.key)) return ContentService.createTextOutput("forbidden");
  let d;
  try { d = JSON.parse(e.postData.contents); } catch (err) { return ContentService.createTextOutput("bad json"); }
  const w = d.word || {}, s = d.stats || {};
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    sheet_().appendRow([
      d.time || new Date().toISOString(), d.user || "", d.event || "", d.source || "",
      w.hanzi || "", w.pinyin || "", w.english || "",
      d.event === "answer" ? (d.correct ? 1 : 0) : "",
      s.answered || 0, s.correct || 0,
    ]);
  } finally { lock.releaseLock(); }
  return ContentService.createTextOutput("ok");
}

// Opening the web app URL shows the dashboard.
function doGet(e) {
  const key = (e.parameter && e.parameter.key) || "";
  if (!allowed_(key)) return HtmlService.createHtmlOutput("Forbidden. Add ?key=... to the URL.");
  const t = HtmlService.createTemplateFromFile("Index");
  t.key = key;
  return t.evaluate().setTitle("Chinese Practice – Dashboard")
    .addMetaTag("viewport", "width=device-width,initial-scale=1");
}

// Called by the dashboard page. Returns plain objects only.
function getStats(key) {
  if (!allowed_(key)) throw new Error("forbidden");
  const rows = sheet_().getDataRange().getValues().slice(1);
  const users = {};
  rows.forEach(r => {
    const [rawTime, user, event, source, hanzi, pinyin, english, correct] = r;
    if (!user) return;
    const time = rawTime instanceof Date ? rawTime.toISOString() : String(rawTime); // Sheets may auto-convert the ISO text
    const u = users[user] || (users[user] = { user, answered: 0, correct: 0, last: "", days: {}, missed: {}, recent: [], perDay: {} });
    const ts = new Date(time), day = isNaN(ts) ? "" : Utilities.formatDate(ts, Session.getScriptTimeZone(), "yyyy-MM-dd");
    if (!u.last || time > u.last) u.last = time;
    if (event !== "answer") return;
    u.answered++;
    if (correct === 1 || correct === "1") u.correct++;
    else { const k = hanzi + "|" + pinyin + "|" + english; u.missed[k] = (u.missed[k] || 0) + 1; }
    if (day) u.perDay[day] = (u.perDay[day] || 0) + 1;
    u.recent.push({ time, hanzi, english, ok: correct === 1 || correct === "1" });
  });
  return Object.values(users).map(u => ({
    user: u.user, answered: u.answered, correct: u.correct, last: u.last,
    perDay: u.perDay,
    missed: Object.entries(u.missed).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => ({ word: k.split("|"), n })),
    recent: u.recent.slice(-10).reverse(),
  })).sort((a, b) => b.last.localeCompare(a.last));
}
