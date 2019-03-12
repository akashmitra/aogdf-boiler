const LOGGER = require('../log');

module.exports ={
  serverError(exception, agent){
    LOGGER.trace(exception);
    agent.add('Oops! There is a glitch in server. Could you please try again later?');
  }
};