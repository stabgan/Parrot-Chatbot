var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var app = express()
var weather = require('openweather-apis');
 
weather.setLang('en');
weather.setAPPID('6aa8478f4c0c55fe2ae9b1424cb7c900');

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


// API End Point - added by Stefan

app.post('/webhook/', function(req, res) {
    messaging_events = req.body.entry[0].messaging
    for (i = 0; i < messaging_events.length; i++) {
        event = req.body.entry[0].messaging[i]
        sender = event.sender.id
        if (event.message && event.message.text) {
            text = event.message.text
            if (text in ['hello','hi','Hello','yo','hii','hey']) {
                sendGenericMessage(sender)
                continue
            }
            
            sendTextMessage(sender, "parrot: " + text.substring(0, 200))
            //weatherX(sender , text)


        }
        if (event.postback) {
            text = JSON.stringify(event.postback)
            sendTextMessage(sender, "Postback received: "+text.substring(0, 200), token)
            continue
        }
    }
    res.sendStatus(200)
})

var token = 'EAAHcUSVmZBjMBAGe6MRfzIJ9XfBck0irEXHg9qbZC6ifEuJ5rhY6TVeKbn1J5TRfHrTaYzujB4PkB7wJ5gQcVKaRp1KYPHfmCE2AOjMWrWhobZAUijqlCkw3D85cGS1B9HSIOCMRZBTLZBjqMvXjAxQ5cT6sxktA4Ftrv9ea3YRIDyIdf53GA'

// function to echo back messages - added by Stefan


function weatherX(sender , word_id){

    weather.setCity(word_id);
    weather.getDescription(function(err, desc){
    if (err) {
            console.log('Error sending messages: ', err)
            text2 = 'enter correctly';
        }
    else {
    text2 = desc; }
    });
    sendTextMessage(sender , text2)
}

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
            console.log(messageData.text)
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
                    },{
                        "type": "postback",
                        "title": "What are his interests ?",
                        "payload": "He is interested in AI , ML , DL , Game Developement , UI/UX , Android , Backend etc ",
                    }],
                },  {
                    "title": "Portfolio",
                    "subtitle": "View my Owner's portfolio website",
                    "image_url": "https://images.unsplash.com/photo-1541422348463-9bc715520974?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&w=1000&q=80",
                    "buttons": [{
                        "type": "web_url",
                        "url": "https://stabgan.github.io",
                        "title": "Click to View"
                    },{
                        "type": "web_url",
                        "url": "https://play.google.com/store/apps/details?id=com.whale.calculator&hl=en_IN",
                        "title": "Click to download his app"
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

