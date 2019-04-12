const UTIL = require('../util/util');
const ERROR_UTIL = require('../util/errorUtil');
const confirmedVacation_service= require('../services/confirmedVacation.service');

module.exports={
  showUpcomingVacation:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      agent.context.set({
        'name':'confirmedvacationcontext',
        'lifespan': 2,
        'parameters':{
          'startResortIndex':0
          }
      });
      
      return new Promise((resolve, reject) => {
        confirmedVacation_service.showUpcomingVacation(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  showMoreUpcomingVacation:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        confirmedVacation_service.showMoreUpcomingVacation(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  },
  
  nextVacationDetails:(agent)=>{
    try{
      var buildResponse=UTIL.buildResponse;
      return new Promise((resolve, reject) => {
        confirmedVacation_service.nextVacationDetails(agent,buildResponse,resolve);
      });
    }
    catch(exception){
      ERROR_UTIL.serverError(exception, agent);
    }
  }
};