const { Carousel, Image } = require('actions-on-google');

module.exports ={
  getRandomMessage:(arr)=>{
    if(arr.length===1){
      return arr[0];
    }
    var index = (Math.floor(Math.random() * 100))% arr.length;
    return arr[index];
  },
  
  buildCarouselItem(obj,key,title,desc,image){
    obj[key]={
      title:title,
      description:desc,
      image:new Image({
        url:image,
        alt:`${key} - ${title}`
      })
    };
    return obj;
  },
  
  isEmpty(val){
    if(val==='' || 
       val===undefined || 
       val==='undefined' || 
       val===null || val===[] || 
       (Object.keys(val).length === 0 && val.constructor === Object)){
      return true;
    }
    return false;
  }
};