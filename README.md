# 🦜 Parrot Chatbot

A Facebook Messenger chatbot that parrots back your messages. Send it anything and it echoes it right back with a "parrot:" prefix. Say "hello" to get interactive cards with the developer's portfolio, LinkedIn, and GitHub links.

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| ⚙️ Runtime | Node.js (>=18) |
| 🌐 Framework | Express.js 4.x |
| 💬 Platform | Facebook Messenger Send API (Graph API v21.0) |
| 🚀 Deployment | Heroku-ready (Procfile included) |

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `express` | HTTP server and routing |

> Native `fetch` (Node 18+) is used for outbound HTTP requests — no extra HTTP client needed.

## 🔧 Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/stabgan/Parrot-Chatbot.git
   cd Parrot-Chatbot
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variables (or edit `index.js` directly):
   ```bash
   export PAGE_ACCESS_TOKEN="your-facebook-page-token"
   export VERIFY_TOKEN="your-verify-token"       # default: Aha_Moment_Labs
   export PORT=5000                               # default: 5000
   ```

4. Start the server:
   ```bash
   npm start
   ```

5. Expose your local server (e.g. with [ngrok](https://ngrok.com)) and configure the webhook URL in the [Facebook Developer Portal](https://developers.facebook.com/).

## 🚀 Deploy to Heroku

```bash
heroku create
git push heroku master
heroku config:set PAGE_ACCESS_TOKEN="your-token"
```

## ⚠️ Known Issues

- The bot requires a valid Facebook Page Access Token to send messages. Without it, all outbound calls will fail.
- The `openweather-apis` and `unirest` packages from the original codebase were unused and have been removed.
- The original code used the deprecated `request` npm package; this version uses the native `fetch` API (Node 18+).
- Facebook's Send API may change; the current integration targets Graph API v21.0.

## 📄 License

MIT
