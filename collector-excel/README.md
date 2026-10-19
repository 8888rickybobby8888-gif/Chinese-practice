# Excel collector (runs on your computer, no Google needed)

A small program that receives the practice site's webhooks, saves every answer into a
real Excel file (`events.xlsx`, next to `server.js`), and serves a dashboard for all users.

## Set up

1. Install Node.js (https://nodejs.org, the LTS version).
2. Open a terminal in this folder (`collector-excel`) and run:
   ```
   npm install
   npm start
   ```
   It prints your webhook URL and dashboard URL (by default `http://localhost:3000/hook`
   and `http://localhost:3000/`).
3. In the practice site, open **Settings**, set the Webhook URL to the printed one, and
   press **Send test**. A row appears in `events.xlsx` (open it in Excel any time, or use
   the "Download Excel" link on the dashboard).

Optional: `SECRET=myword npm start` makes every URL require `?key=myword`
(so the webhook URL becomes `http://localhost:3000/hook?key=myword`).
Set `PORT=...` or `DATA_DIR=...` to change the port or where `events.xlsx` is saved.

## Where the practice site can be

- **Practice site opened from a file or `http://localhost`, same computer:** works as is.
- **Practice site on GitHub Pages (https):** Chrome, Edge and Firefox still allow posting to
  `http://localhost`, so it works from the same computer. Safari may block it.
- **Other devices (a phone, other students):** the collector must be reachable from the
  internet. Run a tunnel such as `npx cloudflared tunnel --url http://localhost:3000`
  (or ngrok) and use the `https://...` address it prints in place of `http://localhost:3000`,
  or host this folder on any Node host (Render, Railway, Fly.io). Set `SECRET` if you do,
  and note a free host's disk may reset, so download `events.xlsx` regularly.

Close Excel's copy of `events.xlsx` while the program is running if Windows says the file
is locked, or just use the dashboard's Download link.
