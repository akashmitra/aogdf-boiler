const UTIL = require('../util/util');
const CONFIG = require('../config');
const REQUEST = require('request');
const { Card } = require('dialogflow-fulfillment');
const { BasicCard, Image, Suggestions } = require('actions-on-google');

module.exports ={
  
  /*showUpcomingVacation: (conv)=>{
    var vacations=UTIL.sortByDateAsc(DATA.confirmed_vacations,'checkin_date');    //Sort Vacation by date 
    
    let startIndex=0;
    if(!UTIL.isEmpty(conv.user.storage.startResortIndex)){
      startIndex=conv.user.storage.startResortIndex;
    }
    let vacation=vacations[startIndex];
    
    if(startIndex==0){
      let response_arr= [
        `There are ${vacations.length} confirmed vacations for you. Earliest one is at ${vacation.resort_name}.`
      ];
      conv.ask(UTIL.getRandomMessage(response_arr));
    }
    
    if (!conv.surface.capabilities.has('actions.capability.SCREEN_OUTPUT')) {
      conv.ask('Sorry, try this on a screen device or select the phone surface in the simulator.');
      return conv;
    }
    
   
    if(startIndex < vacations.length){
      if(startIndex>0){
        conv.ask("Here's the details of the next vacation.");
      }
      
      //UTIL.buildCardItem(title, subtitle, desc, button_title, button_url, image)
      let date_arr=vacation.checkin_date.toString().split(' ');
      let checkinDate=`${date_arr[0]} ${date_arr[2]} ${date_arr[1]} ${date_arr[3]}`;
      conv.ask(UTIL.buildCardItem(
        `#${vacation.resort_code}`,
        `${vacation.resort_name}, ${vacation.location}`,
        `Check-in Date: ${checkinDate}`,
        'Visit Resort',
        'https://www.rci.com/resort-directory/resortDetails?resortCode=2512',
        vacation.image
      ));
      conv.ask(new Suggestions(['Next One']));
      conv.user.storage.startResortIndex++;
    }
    else{
      conv.ask('Sorry, no more Vacations available.');
      conv.ask(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
    }
  }
  showUpcomingVacation: (agent, buildResponse, resolve)=> {
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      const data=JSON.parse(body);
      let confirmedVacations=data.confirmed_vacations;
      var vacations=UTIL.sortByDateAsc(confirmedVacations,
    });
  }*/
  showUpcomingVacation: (agent, buildResponse, resolve)=>{
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let confirmedVacationContext = agent.context.get('confirmedvacationcontext');
      let session=confirmedVacationContext.parameters;
      const data=JSON.parse(body);
      let confirmedVacations=data.confirmed_vacations;
      var vacations=UTIL.sortByDateAsc(confirmedVacations, "checkin_date");
      let richConvList=[],convList=[];
      /*let startIndex=0;
      
      
      if(!UTIL.isEmpty(session.startResortIndex)){
        startIndex=session.startResortIndex;
      }*/
      let vacation=vacations[0];
      console.log(new Date(vacation.checkin_date).getMonth());
      let month= new Date(vacation.checkin_date).getMonth();
      let monthName= UTIL.getMonthName(month);
      let response_arr= [
        `Alright! You have got some great plans coming up, and your next trip is at ${vacation.resort_name} in the month of ${monthName}.`
      ];
      let response_arr_next= [
        `Besides ${vacation.resort_name}, would you like to know about other vacations planned?`
      ];
      
      let msg=UTIL.getRandomMessage(response_arr);
      let msgNext = UTIL.getRandomMessage(response_arr_next);
      richConvList.push(msg);
      richConvList.push(msgNext);
      convList.push(msg);
      convList.push(msgNext);
      
      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
    });
  },
  
  showMoreUpcomingVacation: (agent, buildResponse, resolve)=>{
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      const data=JSON.parse(body);
      let confirmedVacations=data.confirmed_vacations;
      var vacations=UTIL.sortByDateAsc(confirmedVacations, "checkin_date");
      let richConvList=[],convList=[];
      let month="";
      let monthName="";
      var moreVacationsCount=(vacations.length)-1;
      for(let i=1;i<vacations.length;i++)
      {
       month= new Date(vacations[i].checkin_date).getMonth();
        if(i === moreVacationsCount){
             monthName+= UTIL.getMonthName(month);
           }
        else{
          monthName+= UTIL.getMonthName(month)+', ';
        }
       
      }
      
      let response_arr= [`You have ${moreVacationsCount} more vacation planned in the month of ${monthName}.`];
      
      let msg=UTIL.getRandomMessage(response_arr);
      
      richConvList.push(msg);
      convList.push(msg);
      
      if(moreVacationsCount === 1){
        let msgNext= 'Would you like to know about it?';
        richConvList.push(msgNext);
        convList.push(msgNext);
      }
      else{
        let msgNext= 'Which one would you like to know about?';
        richConvList.push(msgNext);
        convList.push(msgNext);
      }

      buildResponse(agent,richConvList,convList);
      resolve();
    })
    .on('error', function(err) {
      console.log(err);
      
    });
  },
  
  nextVacationDetails: (agent, buildResponse, resolve)=>{
     REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
       let confirmedVacationContext=agent.context.get('confirmedvacationcontext');
       let session=confirmedVacationContext.parameters;
       let richConvList=[],convList=[];
       const data=JSON.parse(body);
       let confirmedVacations=data.confirmed_vacations;
       const month= session.time_period;
       const mon= UTIL.getMonthName(month);
       console.log(month);
       var vacation="";
       
       if(!UTIL.isEmpty(month)){
         vacation= UTIL.searchVacationByMonth(confirmedVacations, month);
         //console.log(vacation);
       }
       else if(confirmedVacations.length === 2){
         var vacations=UTIL.sortByDateAsc(confirmedVacations, "checkin_date");
         vacation= vacations[1];
       }
       //let vacation= UTIL.searchVacationByMonth(confirmedVacations, month);
       console.log(vacation.resort_name); 
       let monthName= new Date(vacation.checkin_date).getMonth();
       const checkin=(UTIL.getMonthName(monthName))+" "+(new Date(vacation.checkin_date).getDate());
       
       let response_arr= [`Sure! You have made a booking at ${vacation.resort_name} starting from ${checkin}.`];
       let response_arr1= ['Anything else you would like to know?'];
       
       let msg=UTIL.getRandomMessage(response_arr);
       let msgnext=UTIL.getRandomMessage(response_arr1);
      
       richConvList.push(msg);
       convList.push(msg);
       
       richConvList.push(msgnext);
       convList.push(msgnext);
       
       buildResponse(agent,richConvList,convList);
       resolve();
     })
    .on('error', function(err) {
      console.log(err);
    });
  }
}             