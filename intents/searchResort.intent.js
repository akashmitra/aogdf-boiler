const UTIL = require('../util/util');
const ERROR_UTIL = require('../util/errorUtil');
const searchResort_service = require('../services/searchResort.service');

module.exports ={  
  askLocation:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        searchResort_service.askLocation(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  askDate:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        searchResort_service.askDate(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  searchResort:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      
      /*
        Set Session context
        Ref: https://dialogflow.com/docs/reference/fulfillment-library/webhook-client,
        https://dialogflow.com/docs/contexts/contexts-fulfillment
      */
      let searchResortContext=agent.context.get('searchresortcontext');
      searchResortContext.parameters.startResortIndex=0;                //Reset to beginning
      agent.context.set(searchResortContext);

      return new Promise((resolve, reject) => {
        searchResort_service.searchResort(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  bookResortByIndex:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        searchResort_service.bookResortByIndex(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  searchResortNext:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        searchResort_service.searchResort(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  }
};