# Dashboard collector (Google Sheets)

A small separate website that receives the practice site's webhooks, stores every
answer in a Google Sheet (which opens in Excel via File → Download → .xlsx), and shows
a dashboard for every user. Free, no server to run.

## Set up (about 5 minutes)

1. Go to <https://sheets.new> and name the spreadsheet e.g. "Chinese Practice".
2. **Extensions → Apps Script**. Delete the sample code.
3. Paste `Code.gs` from this folder into the editor.
4. Click **+** next to Files → **HTML**, name it exactly `Index`, and paste `Index.html`.
5. In `Code.gs` change `SECRET` to a private word (this stops strangers posting to it).
6. **Deploy → New deployment → type: Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Deploy, then approve the permissions prompt. Copy the **Web app URL** (ends in `/exec`).
7. In the practice site, open **Settings** and set the Webhook URL to
   `YOUR_WEB_APP_URL?key=YOUR_SECRET`, then press **Send test**.
   A row should appear in the "Events" sheet.
8. Your dashboard is the same URL opened in a browser: `YOUR_WEB_APP_URL?key=YOUR_SECRET`.

If you change the code later: Deploy → Manage deployments → edit → New version.

Each row is: time, user, event (login/answer/test), source (flashcards/quiz), hanzi,
pinyin, english, correct (1/0), running totals.
