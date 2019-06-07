var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()

app.set('port', (process.env.PORT || 5000))
// Process application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}))
// Process application/json
app.use(bodyParser.json())
// Index route
app.get('/', function (req, res) {
    res.send('please visit https://m.me/stabganpage')
})
// for Facebook verification
app.get('/webhook/', function (req, res) {
    if (req.query['hub.verify_token'] === 'Aha_Moment_Labs') {
        res.send(req.query['hub.challenge'])
    }
    res.send('Error, wrong token')
})
// Spin up the server
app.listen(app.get('port'), function() {
    console.log('running on port', app.get('port'))
})

app.post('/webhook/', function(req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text === 'hello') {
                sendGenericMessage(sender)
                continue
            }
            if (Math.floor(Math.random() * 5) == 3){
                sendTextMessage(sender, "I'm a bot and I have a pet parrot who will mimic you haha!\nType hello to see my owner's social media links.")
            }
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))

        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})
var token = 'EAAHcUSVmZBjMBAOdstVJR8rqKLm845rZCHjQK6v4s0vMpBi2Al8wpO1ZC7mtoB57e90dXEhyZAaZCx6VKwM6gfTa8vy174cvmss8rXi8QKNUPnrwQPzJ1XaK9CYxnZBDjyQWQBp8YYIrEYXlERV8ILxUMzlET9o0mse6n7MKpyfRsBQB33xScx'

function sendTextMessage(sender, text) {
    messageData = {
        text:text
    }
    request({
        url: 'https://graph.facebook.com/v3.3/me/messages',
        qs: {access_token:token},
        method: 'POST',
        json: {
            recipient: {id:sender},
            message: messageData,
        }
    }, function(error, response, body) {
        if (error) {
            console.log('Error sending messages: ', error)
        } else if (response.body.error) {
            console.log('Error: ', response.body.error)
        }
    })
}
// Send an test message back as two cards.
function sendGenericMessage(sender) {

    messageData = {
        "attachment": {

            "type": "template",
            "payload": {

                "template_type": "generic",

                "elements": [{

                    "title": "Portfolio",

                    "subtitle": "Portfolio Website",

                    "image_url": "https://images.unsplash.com/photo-1541422348463-9bc715520974?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",

                    "buttons": [{

                        "type": "web_url",

                        "url": "https://stabgan.github.io",

                        "title": "Click to View"

                    },{

                        "type": "web_url",

                        "url": "https://play.google.com/store/apps/details?id=com.whale.calculator&hl=en_IN",

                        "title": "Download Android app"

                    }, {

                    "title": "LinkedIn",

                    "subtitle": "Connect with my owner !",

                    "image_url": "https://cdn1.iconfinder.com/data/icons/logotypes/32/square-linkedin-512.png",

                    "buttons": [{

                        "type": "web_url",

                        "url": "https://linkedin.com/in/stabgan",

                        "title": "Click to connect"

                    }],

                }, {

                    "title": "Github",

                    "subtitle": "View my Owner's projects",

                    "image_url": "https://i.vimeocdn.com/video/253024709.webp?mw=900&mh=508&q=70",

                    "buttons": [{

                        "type": "web_url",

                        "url": "https://github.com/stabgan",

                        "title": "Click to View"

                    }],

                }],

                }]  

            } 

        }

    }

    request({

        url: 'https://graph.facebook.com/v3.3/me/messages',

        qs: {access_token:token},

        method: 'POST',

        json: {

            recipient: {id:sender},

            message: messageData,

        }

    }, function(error, response, body) {

        if (error) {

            console.log('Error sending messages: ', error)

        } else if (response.body.error) {

            console.log('Error: ', response.body.error)

        }

    })

}