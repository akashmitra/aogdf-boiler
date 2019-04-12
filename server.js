(function () {
    'use strict';

    const express = require('express');
    const bodyParser = require('body-parser');
    const http = require('http');
  
    const { WebhookClient } = require('dialogflow-fulfillment');
    const { Carousel, Image } = require('actions-on-google');
  
    /*---------------------- Utils ----------------------*/
    const logger = require('./log');
    const UTIL = require('./util/util');
    const ERROR_UTIL = require('./util/errorUtil');
    /*---------------------- Utils ----------------------*/
  
    /*---------------------- Intents ----------------------*/
    const welcome_intent = require('./intents/welcome.intent');
    const searchResort_intent = require('./intents/searchResort.intent');
    const deposit_intent = require('./intents/deposit.intent.js');
    const confirmedVacation_intent = require('./intents/confirmedVacation.intent.js');
    const fallback_intent = require('./intents/fallback.intent');
    const exit_intent = require('./intents/exit.intent');
    /*---------------------- Intents ----------------------*/
  
    /*---------------------- Services ----------------------*/
    const searchResort_service = require('./services/searchResort.service');
    const deposit_service = require('./services/deposit.service');
    const confirmedVacation_service = require('./services/confirmedVacation.service');
    const exit_service = require('./services/exit.service');
    const fallback_service = require('./services/fallback.service');
    /*---------------------- Services ----------------------*/
    
    const port = process.env.PORT || 3000;
    process.env.DEBUG = 'dialogflow:debug';

    const app = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({
        extended: true
    }));

  
    app.post('/', (request, response) => {
      //console.log(request);
      const agent = new WebhookClient({ request: request, response: response });
      logger.trace('Dialogflow Request headers: ' + JSON.stringify(request.headers));
      logger.trace('Dialogflow Request body: ' + JSON.stringify(request.body));
      console.log(agent);
      console.log(`Intent: ${agent.intent}`);
      var buildResponse=UTIL.buildResponse;
      
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
      

      // Dialogflow intent Function Mapping
      let intentMap = new Map();
      intentMap.set('DefaultWelcomeIntent', welcome_intent.welcome);
      intentMap.set('DefaultFallbackIntent', fallback_intent.fallback);
      intentMap.set('Exit', exit_intent.exit);
      
      /*---------------------SEARCH RESORT INTENT START------------------*/
      intentMap.set('SearchResortIntent', searchResort_intent.askLocation);
      intentMap.set('SearchResortIntent.askLocation', searchResort_intent.askDate);
      intentMap.set('SearchResortIntent.askLocation.askDate', searchResort_intent.searchResort);
      intentMap.set('SearchResortIntent.askLocation.askDate.askIndex', searchResort_intent.bookResortByIndex);
      intentMap.set('SearchResortIntent.askLocation.askDate.askIndex.no',  exit_intent.exit);
      intentMap.set('SearchResortIntent.next', searchResort_intent.searchResortNext);
      /*---------------------SEARCH RESORT INTENT END------------------*/
      
      /*---------------------CONFIRMED VACATION INTENT START------------------*/
      intentMap.set('ConfirmedVacationIntent', confirmedVacation_intent.showUpcomingVacation);
      intentMap.set('ConfirmedVacationIntent.yes', confirmedVacation_intent.showMoreUpcomingVacation);
      intentMap.set('ConfirmedVacationIntent.yes.next', confirmedVacation_intent.nextVacationDetails);
      intentMap.set('ConfirmedVacationIntent.yes.yes', confirmedVacation_intent.nextVacationDetails);
      intentMap.set('ConfirmedVacationIntent.yes.no', exit_intent.exit);
      intentMap.set('ConfirmedVacationIntent.no', exit_intent.exit);
      /*---------------------CONFIRMED VACATION INTENT END------------------*/
      
      /*---------------------DEPOSIT DETAILS INTENT START------------------*/
      intentMap.set('DepositDetailsIntent', deposit_intent.depositDetails);
      intentMap.set('DepositDetailsIntent.details', deposit_intent.furtherDetails);
      intentMap.set('DepositDetailsIntent.details.maxTp', deposit_intent.maxTradingPoints);
      intentMap.set('DepositDetailsIntent.details.no', exit_intent.exit);
      intentMap.set('DepositDetailsIntent.no', exit_intent.exit);
      /*---------------------DEPOSIT DETAILS INTENT END------------------*/
      
      agent.handleRequest(intentMap);
    });
  
  
    app.get('/', (request, response) => {
      response.send('Say hello to AOG Chatbot! Running on port: '+process.env.PORT);
      logger.trace(`Get hit!`);
    });


    // Creating a server at port 
    http.createServer(app).listen(port, () => {
        logger.trace(`Express server listening on port ${port}`);
    });
}());
