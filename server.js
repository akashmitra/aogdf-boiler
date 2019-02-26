(function () {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');
    const http = require('http');
    const logger = require('./log');
    const { WebhookClient } = require('dialogflow-fulfillment');
    const { Card, Suggestion } = require('dialogflow-fulfillment');
    const { Carousel } = require('actions-on-google');

    const port = process.env.PORT || 3000;
    process.env.DEBUG = 'dialogflow:debug';

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

    // URLs for images used in card rich responses
    const imageUrl = 'https://developers.google.com/actions/images/badges/XPM_BADGING_GoogleAssistant_VER.png';
    const imageUrl2 = 'https://lh3.googleusercontent.com/Nu3a6F80WfixUqf_ec_vgXy_c0-0r4VLJRXjVFF_X_CIilEu8B9fT35qyTEj_PEsKw';
    const linkUrl = 'https://assistant.google.com/';


    app.post('/dialogflow', (request, response) => {

        const agent = new WebhookClient({ request: request, response: response });
        logger.trace('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        logger.trace('Dialogflow Request body: ' + JSON.stringify(request.body));

        function googleAssistantOther(agent) {
            let conv = agent.conv(); // Get Actions on Google library conversation object
            conv.ask('Please choose an item:');
            conv.ask(new Carousel({
                title: 'Google Assistant',
                items: {
                    'WorksWithGoogleAssistantItemKey': {
                        title: 'Works With the Google Assistant',
                        description: 'If you see this logo, you know it will work with the Google Assistant.',
                        image: {
                            url: imageUrl,
                            accessibilityText: 'Works With the Google Assistant logo',
                        },
                    },
                    'GoogleHomeItemKey': {
                        title: 'Google Home',
                        description: 'Google Home is a powerful speaker and voice Assistant.',
                        image: {
                            url: imageUrl2,
                            accessibilityText: 'Google Home'
                        },
                    },
                },
            }));
            agent.add(conv);
        }

        function welcome(agent) {
            agent.add(`Welcome to my agent!`);
        }

        function fallback(agent) {
            agent.add(`I didn't understand`);
            agent.add(`I'm sorry, can you try again?`);
        }

        function testWebhook(agent) {
            agent.add(`This went right inside Webhook`);
        }

        function other(agent) {
            agent.add(`This message is from Dialogflow's Cloud Functions for Firebase editor!`);
            agent.add(new Card({
                title: `Title: this is a card title`,
                imageUrl: imageUrl,
                text: `This is the body text of a card.  You can even use line\n  breaks and emoji! 💁`,
                buttonText: 'This is a button',
                buttonUrl: linkUrl
            })
            );
            agent.add(new Suggestion(`Quick Reply`));
            agent.add(new Suggestion(`Suggestion`));
            agent.context.set({ name: 'weather', lifespan: 2, parameters: { city: 'Rome' } });
        }


        // Dialogflow intent Function Mapping
        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('TestWebhook', testWebhook);

        // Intent Error Handling: If req from Google Assistant use fn(googleAssistantOther) else fn(other)
        if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
            intentMap.set(null, googleAssistantOther);
        } else {
            intentMap.set(null, other);
        }
        agent.handleRequest(intentMap);
    });


    // Creating a server at port 
    http.createServer(app).listen(port, () => {
        logger.trace("Express server listening on port 3000");
    });

}());