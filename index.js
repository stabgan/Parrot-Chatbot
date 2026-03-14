const express = require('express');
const app = express();

const PORT = process.env.PORT || 5000;
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN || '[Enter your token here]';
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'Aha_Moment_Labs';

// Parse application/x-www-form-urlencoded and application/json (built into Express 4.16+)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Index route
app.get('/', (req, res) => {
  res.send('Please visit https://m.me/stabganpage');
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
  const messagingEvents = req.body.entry[0].messaging;

  for (let i = 0; i < messagingEvents.length; i++) {
    const event = messagingEvents[i];
    const sender = event.sender.id;

    if (event.message && event.message.text) {
      const text = event.message.text;

      if (text === 'hello') {
        sendGenericMessage(sender);
        continue;
      }

      if (Math.floor(Math.random() * 5) === 3) {
        sendTextMessage(
          sender,
          "I'm a bot and I have a pet parrot who will mimic you haha!\nType hello to see my owner's social media links."
        );
      }

      sendTextMessage(sender, 'parrot: ' + text.substring(0, 200));
    }

    if (event.postback) {
      const postbackText = JSON.stringify(event.postback);
      sendTextMessage(sender, 'Postback received: ' + postbackText.substring(0, 200));
      continue;
    }
  }

  res.sendStatus(200);
});

/**
 * Send a plain text message via the Facebook Send API.
 */
async function sendTextMessage(sender, text) {
  const messageData = { text };

  try {
    const response = await fetch('https://graph.facebook.com/v21.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: sender },
        message: messageData,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      console.error('Error sending message:', body.error || body);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

/**
 * Send a generic template message (cards) via the Facebook Send API.
 */
async function sendGenericMessage(sender) {
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
              'https://images.unsplash.com/photo-1541422348463-9bc715520974?w=1000&q=80',
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

  try {
    const response = await fetch('https://graph.facebook.com/v21.0/me/messages?access_token=' + PAGE_ACCESS_TOKEN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipient: { id: sender },
        message: messageData,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      console.error('Error sending message:', body.error || body);
    }
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

// Start server
app.listen(PORT, () => {
  console.log('Server running on port', PORT);
});
