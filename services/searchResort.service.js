const UTIL = require('../util/util');
const CONFIG = require('../config');
const { Carousel, BrowseCarousel, Image, Suggestions } = require('actions-on-google');
const REQUEST = require('request');

module.exports ={
  
  askLocation: (agent,buildResponse,resolve)=> {
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let richConvList=[],convList=[];
      const msg='Sure, I would love to help you with that, where do you want to go for your vacations?';
      richConvList.push(msg);
      convList.push(msg);
      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
    });
  },
  
  askDate: (agent,buildResponse,resolve)=> {
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let richConvList=[],convList=[];
      const msg='Oh! That’s a great place I must say. When and for how long are you planning your stay?';
      richConvList.push(msg);
      convList.push(msg);
      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
    });
  },
  
  bookResortByIndex: (agent,buildResponse,resolve)=> {
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let richConvList=[],convList=[];
      let searchresortcontext = agent.context.get('searchresortcontext');
      let resorts = JSON.parse(body).resort_details;
      let session= searchresortcontext.parameters;
      let days = session.dayCount;
      let index = session.index - 1;
      let checkinDate = session.checkinDate.split('T')[0];
      checkinDate = String(new Date(checkinDate)).slice(0,15);
      
      let temp=[];
       for(let i=0; i<resorts.length; i++){
         let resort=resorts[i];
         if(resort.location.toLowerCase() == session.location.toLowerCase()){
           temp.push(resorts[i]);
        }
      }
      let selected_resort = temp[index];
          selected_resort = selected_resort.resort_name;      
      
      let msg= `Great choice! Your booking has been made for a period of ${days} days starting from ${checkinDate}, at ${selected_resort}. Hope you have a wonderful stay! Is there anything else I can help you with?`;
      richConvList.push(msg);
      convList.push(msg);
      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
    });
  },
  
  
  searchResort: (agent,buildResponse,resolve)=> {
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let searchResortContext=agent.context.get('searchresortcontext');
      let session=searchResortContext.parameters;
      let resorts = JSON.parse(body).resort_details;
      const checkinDate=session.checkinDate.split('T')[0];
      let richConvList=[],convList=[];
      
      //Search resorts in location
      let temp=[];
      for(let i=0; i<resorts.length; i++){
        let resort=resorts[i];
        if(resort.location.toLowerCase() == session.location.toLowerCase()){
          temp.push(resorts[i]);
        }
      }
      resorts=temp;
      
      let resort_list=[],resort_list_script='';
      let startIndex=0;
      if(!UTIL.isEmpty(session.startResortIndex)){
        startIndex=session.startResortIndex;
      }
      for(let i=startIndex; i<startIndex+CONFIG.searchResortPagination_count && i<resorts.length; i++){
        let resort=resorts[i];
        let item=UTIL.buildBrowserCarouselItem(`#${resort.resort_code}`,
                                        resort.resort_name,
                                        resort.image,
                                        'https://www.rci.com/resort-directory/resortDetails?resortCode=2512',
                                        resort.location);
        resort_list.push(item);
        resort_list_script+=`${resort.resort_name} - ${resort.desc}, `;
        
        //Increase startResortIndex and set session
        searchResortContext.parameters.startResortIndex++;
        agent.context.set(searchResortContext);
      }
      
      let response_arr = [
        'Noted! You chose a wonderful place for your vacation. We do have a couple of resorts perfect for your stay, you can be at '
        //`These are the resorts available between ${checkin} and ${checkout}:`,
        //`You can choose among the following hotels for your date starting from ${checkin} to ${checkout}:`
      ];
      if(!UTIL.isEmpty(resort_list)){
        if(startIndex===0){
          let msg=UTIL.getRandomMessage(response_arr);
          richConvList.push(msg);
          convList.push(msg+resort_list_script);
        }
        else{
          let msg=`Here are ${resort_list.length} more resorts for you.`;
          richConvList.push(msg);
          convList.push(msg);
        }
        richConvList.push(new BrowseCarousel({
          items:resort_list
        }));
        let msg='Do you like any of our choices? Or you have something specific in mind?';
        richConvList.push(msg);
        richConvList.push(new Suggestions(['Show more','Search resorts in Hawaii']));
        //convList.push(resort_list_script);
        convList.push(msg);
      }
      else{
        let msg='Sorry, no more resorts available.';
        richConvList.push(msg);
        richConvList.push(new Suggestions(['Search resorts in Hawaii', 'Upcoming vacations']));
      }
      
      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
    });
  }
}