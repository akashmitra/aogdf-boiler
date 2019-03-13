(function () {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');
    const http = require('http');
    const logger = require('./log');
    const UTIL = require('./util/util');
    const ERROR_UTIL = require('./util/errorUtil');
    const welcome_service = require('./services/welcome_service');
    const searchResort_service = require('./services/searchResort_service');
    const deposit_service = require('./services/deposit_service');
    const confirmedVacation_service = require('./services/confirmedVacation_service');
    const goodbye_service = require('./services/goodbye_service');
    const fallback_service = require('./services/fallback_service');
    const { WebhookClient } = require('dialogflow-fulfillment');
    const { Card, Suggestion } = require('dialogflow-fulfillment');
    const { Carousel, Image } = require('actions-on-google');
    
    const port = process.env.PORT || 3000;
    process.env.DEBUG = 'dialogflow:debug';

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));


    app.post('/', (request, response) => {
        logger.trace(`Post hit!`);
        const agent = new WebhookClient({ request: request, response: response });
        logger.trace('Dialogflow Request headers: ' + JSON.stringify(request.headers));
        logger.trace('Dialogflow Request body: ' + JSON.stringify(request.body));
        console.log(request.body);
        let callback=UTIL.buildResponse;

        function welcome() {
          try{
            welcome_service.welcome(agent,callback);
          }
          catch(exception){
            ERROR_UTIL.serverError(exception, agent);
          }
        }

        function fallback() {
          try{
            let conv = agent.conv();
            agent.add(fallback_service.fallback(conv));
          }
          catch(exception){
            ERROR_UTIL.serverError(exception, agent);
          }
        }
      
        function searchResort(){
          try{
            let location = request.body.queryResult.parameters.geostate;
            let checkin_date = request.body.queryResult.parameters.checkin;
            let checkout_date = request.body.queryResult.parameters.checkout;

            let conv = agent.conv();
            conv.user.storage.startResortIndex=0;        //Reset to beginning
            conv.user.storage.resortLocation=location;    //Store location in session
            conv.user.storage.checkin_date=checkin_date;
            conv.user.storage.checkout_date=checkout_date;
            searchResort_service.searchResort(checkin_date,
                                              checkout_date,
                                              location,
                                              conv);
            agent.add(conv);
          }
          catch(exception){
            ERROR_UTIL.serverError(exception, agent);
          }
        } 
      
      function searchResortNext(){
        try{
          let conv = agent.conv();
          searchResort_service.searchResort(conv.user.storage.checkin_date,
                                            conv.user.storage.checkout_date,
                                            conv.user.storage.resortLocation,
                                            conv);
          agent.add(conv);
          }
        catch(exception){
          ERROR_UTIL.serverError(exception, agent);
        }
      }
      
      function depositTradingPower() {
        try{
          let conv = agent.conv();
          agent.add(deposit_service.depositTradingPower(conv));
        }
        catch(exception){
          ERROR_UTIL.serverError(exception, agent);
        }
      }
      
      function depositDetails(){
        try{
          let conv = agent.conv();
          deposit_service.depositDetails(conv);
          agent.add(conv);
        }
        catch(exception){
          ERROR_UTIL.serverError(exception, agent);
        }
      }
      
      function upcomingVacation(){
        try{
          let conv = agent.conv();
          conv.user.storage.startResortIndex=0;
          confirmedVacation_service.showUpcomingVacation(conv);
          agent.add(conv);
        }
        catch(exception){
          ERROR_UTIL.serverError(exception, agent);
        }
      } 
      
       function upcomingVacationNext(){
         try{
          let conv = agent.conv();
          confirmedVacation_service.showUpcomingVacation(conv);
          agent.add(conv);
         }
          catch(exception){
            ERROR_UTIL.serverError(exception, agent);
          }
       }
      
       function exit(agent) {
          agent.add(goodbye_service.exit());
        }

        function testWebhook(agent) {
            agent.add(`This went right inside Webhook`);
        }


        // Dialogflow intent Function Mapping
        let intentMap = new Map();
        intentMap.set('Default Welcome Intent', welcome);
        intentMap.set('Default Fallback Intent', fallback);
        intentMap.set('Search Resort', searchResort);
        intentMap.set('Search Resort Next', searchResortNext);
        intentMap.set('Deposit Trading Power', depositTradingPower);
        intentMap.set('Deposit Details', depositDetails);
        intentMap.set('Vacation Details', upcomingVacation);
        intentMap.set('Vacation Details Next', upcomingVacationNext);
        intentMap.set('Exit', exit);
        intentMap.set('TestWebhook', testWebhook);

        // Intent Error Handling: If req from Google Assistant use fn(googleAssistantOther) else fn(other)
        // if (agent.requestSource === agent.ACTIONS_ON_GOOGLE) {
        //     intentMap.set(null, googleAssistantOther);
        // } else {
        //     intentMap.set(null, other);
        // }
        agent.handleRequest(intentMap);
    });
  
    app.get('/', (request, response) => {
      response.send('Say hello to SasChatter! Running on port: '+process.env.PORT);
      logger.trace(`Get hit!`);
    });


    // Creating a server at port 
    http.createServer(app).listen(port, () => {
        logger.trace(`Express server listening on port ${port}`);
    });
}());
