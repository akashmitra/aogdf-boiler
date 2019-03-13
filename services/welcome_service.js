const UTIL = require('../util/util');
const DATA = require('../data/data');
const { Carousel, Image, Suggestions } = require('actions-on-google');

module.exports ={
  
  welcome:(agent,callback)=> {
    let convList=[];
    let fname=DATA.user.name.split(' ')[0];
    var welcome_arr = [
      `Hello ${fname}, Welcome to RITZY Hotels & Resorts. How can I assist you?`,
      `Good Day ${fname}, Welcome to RITZY Hotels & Resorts. How can I help you?`,
      `Hi ${fname}, Greetings from RITZY hotels & Resorts. I am here to help you. What assistance do you require?`
    ];
    
    let convMessage=UTIL.getRandomMessage(welcome_arr);
    
    convList.push(convMessage);
    convList.push(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
    callback(agent,convList,convMessage);    //buildResponse:(agent,convList,convMessage)
  }
}