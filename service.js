const DATA = require('./data/data');
const util = require('./util');

module.exports ={
  
  depositTradingPower:()=> {
    var deposits = DATA.deposit_details;
    let max_trading_power = 0;
    deposits.filter((deposit) => {
      if(deposit.trading_power>max_trading_power){
        max_trading_power=deposit.trading_power;
      }
    });
    var response_arr = [
      `The maximum deposit trading power you have is ${max_trading_power}`
    ];
    return util.getRandomMessage(response_arr);
  },
  
  exit:()=> {
    let fname=DATA.user.name.split(' ')[0];
    var exit_arr = [
    `Thank you ${fname} for using RITZY Hotels & Resorts. Good Bye!!!`
    ];
    return util.getRandomMessage(exit_arr);
  }
}