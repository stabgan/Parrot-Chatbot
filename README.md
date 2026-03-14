# 🦜 Parrot Chatbot

A Facebook Messenger chatbot that echoes your messages back — like a parrot. Send it any text and it repeats it; say "hello" to get social-media link cards.

## How It Works

The bot runs an Express server with a `/webhook/` endpoint that Facebook's Messenger Platform calls for every incoming message. On each message the bot:

1. Checks if the text is `hello` → responds with a generic template (cards with portfolio, LinkedIn, and GitHub links).
2. Otherwise echoes the message back prefixed with `parrot:`.
3. Occasionally (1-in-5 chance) adds a fun disclaimer that it's a bot with a pet parrot.

## 🛠 Tech Stack

| Component | Technology |
|-----------|-----------|
| 🟢 Runtime | Node.js ≥ 18 |
| 🚂 Framework | Express 4 |
| 💬 Platform | Facebook Messenger (Graph API v21.0) |
| 🌐 HTTP Client | Built-in `fetch` (Node 18+) |
| ☁️ Deploy | Heroku-ready (Procfile included) |

## Setup

1. **Clone**
   ```bash
   git clone https://github.com/stabgan/Parrot-Chatbot.git
   cd Parrot-Chatbot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your Facebook Page Access Token
   ```

4. **Run**
   ```bash
   npm start
   ```

5. **Set up Facebook Webhook**
   - Create a Facebook App and Page at [developers.facebook.com](https://developers.facebook.com)
   - Subscribe the webhook to your server's `/webhook/` endpoint
   - Use the verify token from `.env` (default: `Aha_Moment_Labs`)

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PAGE_ACCESS_TOKEN` | Facebook Page access token | _(required)_ |
| `VERIFY_TOKEN` | Webhook verification token | `Aha_Moment_Labs` |
| `PORT` | Server port | `5000` |

## ⚠️ Known Issues

- The `openweather-apis` integration referenced in the original code was unused and has been removed. Re-add it if weather features are planned.
- The Facebook Graph API token must be set via environment variable — the old hardcoded placeholder has been removed for security.

## License

MIT
