const UTIL = require('../util/util');
const ERROR_UTIL = require('../util/errorUtil');
const depositDetails_service = require('../services/deposit.service');

module.exports ={
  depositDetails:(agent)=>{
    try{
      const buildResponse = UTIL.buildResponse;
      const contextName = 'depositDetails';
      const lifeSpan=2;
      agent.context.set(contextName, lifeSpan);
      
      return new Promise((resolve, reject) => {
            depositDetails_service.depositDetails(agent,buildResponse,resolve);
          });
    }catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  furtherDetails:(agent)=>{
    try{
      const buildResponse = UTIL.buildResponse;
      return new Promise((resolve, reject) => {
          depositDetails_service.furtherDetails(agent,buildResponse,resolve);
      });
    }catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  maxTradingPoints:(agent)=>{
    try{
      const buildResponse = UTIL.buildResponse;
      return new Promise((resolve, reject) => {
          depositDetails_service.MaxTradingPoints(agent,buildResponse,resolve);
      });
    }catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  }
};