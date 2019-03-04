const UTIL = require('../util');
const CONFIG = require('../config');
const DATA = require('../data/data');
const { Card } = require('dialogflow-fulfillment');
const { Carousel, Image, Suggestions } = require('actions-on-google');

module.exports ={
 
  searchResort: (location, conv)=> {
    var resorts = DATA.resort_details;
    let response_arr = [
      'These are the resorts available on these dates:',
      'You can choose among the following hotels:',
    ];
    
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      conv.ask('Sorry, try this on a screen device or select the phone surface in the simulator.');
      return conv;
    }
    
    //Search resorts in location - CONFIG.pagination_count
    let temp=[];
    for(let i=0; i<resorts.length; i++){
      let resort=resorts[i];
      if(resort.location.toLowerCase() == location.toLowerCase()){
        temp.push(resorts[i]);
      }
    }
    resorts=temp;
    
    let resort_list={};
    let startIndex=0;
    if(!UTIL.isEmpty(conv.user.storage.startResortIndex)){
      startIndex=conv.user.storage.startResortIndex;
    }
    for(let i=startIndex; i<startIndex+CONFIG.pagination_count && i<resorts.length; i++){
      let resort=resorts[i];
      //UTIL.buildCarouselItem(obj,key,title,desc,image)
      UTIL.buildCarouselItem(resort_list,
                             resort.resort_code,
                             resort.resort_code,
                             `${resort.resort_name}, Location: ${resort.location}`,
                             resort.image);
      conv.user.storage.startResortIndex++;
    }
    
    if(!UTIL.isEmpty(resort_list)){
      conv.ask(UTIL.getRandomMessage(response_arr));
      conv.ask(new Carousel({
        items:resort_list
      }));
      conv.ask(new Suggestions(['Show more']));
    }
    else{
      conv.ask('Sorry, no more resorts available.');
    }
  }
}