'use strict';

const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || '';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'Aha_Moment_Labs';

// Express 4.16+ has built-in body parsing — no need for body-parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Index route
app.get('/', (_req, res) => {
  res.send('Parrot Chatbot is running 🦜');
});

// Facebook webhook verification
app.get('/webhook/', (req, res) => {
  if (req.query['hub.verify_token'] === VERIFY_TOKEN) {
    return res.send(req.query['hub.challenge']);
  }
  return res.status(403).send('Error, wrong token');
});

// Handle incoming messages
app.post('/webhook/', (req, res) => {
  const messagingEvents = req.body.entry?.[0]?.messaging ?? [];

  for (const event of messagingEvents) {
    const senderId = event.sender.id;

    if (event.message && event.message.text) {
      const text = event.message.text;

      if (text.toLowerCase() === 'hello') {
        sendGenericMessage(senderId);
        continue;
      }

      if (Math.floor(Math.random() * 5) === 3) {
        sendTextMessage(
          senderId,
          "I'm a bot and I have a pet parrot who will mimic you haha!\nType hello to see my owner's social media links."
        );
      }

      sendTextMessage(senderId, 'parrot: ' + text.substring(0, 200));
    }

    if (event.postback) {
      const postbackText = JSON.stringify(event.postback);
      sendTextMessage(senderId, 'Postback received: ' + postbackText.substring(0, 200));
    }
  }

  res.sendStatus(200);
});

/**
 * Send a plain text message via the Messenger Platform.
 * Uses Node.js built-in fetch (18+) instead of the deprecated `request` package.
 */
async function sendTextMessage(recipientId, text) {
  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: { text },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Graph API error:', data.error || data);
    }
  } catch (err) {
    console.error('Error sending message:', err.message);
  }
}

/**
 * Send a generic template (cards) with social links.
 */
async function sendGenericMessage(recipientId) {
  const messageData = {
    attachment: {
      type: 'template',
      payload: {
        template_type: 'generic',
        elements: [
          {
            title: 'Portfolio',
            subtitle: "View my Owner's portfolio website",
            image_url:
              'https://images.unsplash.com/photo-1541422348463-9bc715520974?w=600&q=80',
            buttons: [
              {
                type: 'web_url',
                url: 'https://stabgan.github.io',
                title: 'Click to View',
              },
              {
                type: 'web_url',
                url: 'https://play.google.com/store/apps/details?id=com.whale.calculator&hl=en_IN',
                title: 'Download his app',
              },
            ],
          },
          {
            title: 'LinkedIn',
            subtitle: 'Connect with my owner!',
            image_url:
              'https://cdn1.iconfinder.com/data/icons/logotypes/32/square-linkedin-512.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://linkedin.com/in/stabgan',
                title: 'Click to connect',
              },
            ],
          },
          {
            title: 'Github',
            subtitle: "View my Owner's projects",
            image_url:
              'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
            buttons: [
              {
                type: 'web_url',
                url: 'https://github.com/stabgan',
                title: 'Click to View',
              },
            ],
          },
        ],
      },
    },
  };

  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${PAGE_ACCESS_TOKEN}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: recipientId },
        message: messageData,
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Graph API error:', data.error || data);
    }
  } catch (err) {
    console.error('Error sending generic message:', err.message);
  }
}

// Start server
app.listen(PORT, () => {
  console.log(`Parrot Chatbot running on port ${PORT}`);
});
