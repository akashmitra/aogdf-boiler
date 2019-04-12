const UTIL = require('../util/util');
const CONFIG = require('../config');
const { Carousel, BrowseCarousel, Image, Suggestions } = require('actions-on-google');
const REQUEST = require('request');

module.exports ={
  
//   this will list down all the resorts available
  depositDetails:(agent, buildResponse,resolve)=>{
	  REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let resortName = "";
      const data = JSON.parse(body);
      var deposits = data.deposit_details;
      let richConvList=[] , convList = [];
      let resortNameSuggestions="";
      var response_arr1 =[
      'It seems you have some deposits at'
      ]
      for(var i=0 ; i<deposits.length ; i++){
        
        resortName += deposits[i].resort_name + ", ";
      }
      var response_arr3 = [
        '. You would like to know the details of?'
      ];
      let msg1=UTIL.getRandomMessage(response_arr1);
      // let msg2=UTIL.getRandomMessage(resortName);
      let msg3=UTIL.getRandomMessage(response_arr3);
      richConvList.push(msg1+" \r\n"+resortName+" \r\n"+msg3);
      // richConvList.push(new Suggestions(['Search resorts in Florida', 'My max TP', 'Upcoming vacations']));
      // richConvList.push(new Suggestions([resortNameSuggestions]));
      convList.push(msg1+" "+resortName+" "+msg3);
		  buildResponse(agent,richConvList,convList);
		  resolve();
	  })
    .on('error', function(err){
		  console.log(err);
	  });
  },
  
//   this will take up response from user and give extended details of the chosen resort
//   from above function's list
  furtherDetails:(agent, buildResponse,resolve)=>{
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      let resortname = agent.context.get('depositdetailsintentcontext').parameters['resortName'];
      let relation_no="";
      var flag=0;
      let trading_power="";
      let result = "";
      const data = JSON.parse(body);
      var deposits = data.deposit_details;
      let richConvList=[] , convList = [];
      
      for(var i=0 ; i<deposits.length ; i++){
        if(resortname===deposits[i].resort_name){
          relation_no=deposits[i].relation_no;
          trading_power=deposits[i].trading_power;
          result = 'Your deposit at '+resortname+' having trading power of '+trading_power+' and bearing relation number '+relation_no+' is available for a search request. '
          +'Can I help you with anything else?'
          flag=1;
        }
           }
        if(flag===0){
        result="The resort you have entered for details does not match the resort you have available.";
      }
      richConvList.push(result);
      convList.push(result);
      buildResponse(agent,richConvList,convList);
		  resolve();
    })
    .on('error', function(err){
		  console.log(err);
	  });
  },
  
//   if user wants to know the max trading points then this will show the max trading points the user has
  MaxTradingPoints:(agent,buildResponse,resolve)=>{
    REQUEST.get(CONFIG.api_endpoint, function(error, response, body){
      const data=JSON.parse(body);
      let result="";
      let maxTradingPower=0;
      let richConvList=[] , convList = [];
      let deposits=data.deposit_details;
      for(let i=0;i<deposits.length;i++){
        if(deposits[i].trading_power>maxTradingPower){
          maxTradingPower=deposits[i].trading_power;         
        }       
      }
      result="you have max trading power of  "+maxTradingPower+". Do you need any other assistance?"
      richConvList.push(result);
      convList.push(result);
      buildResponse(agent,richConvList,convList);
		  resolve();
      })
      .on('error',function(err){
        console.log(err);
      });
    }
}