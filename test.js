const ytdl = require('ytdl-core');


async function checkTrack(param) {
    
    
    let info = await ytdl.getInfo(param);
    console.log(info.videoDetails.media.category)
    console.log(info.videoDetails.category)
  // 
    function checkCategory(info){
      if(info.videoDetails.media.category == "Music" || info.videoDetails.category === "Music" || info.videoDetails.category === "Entertainment"){
          return true;
      } else {
          return false;
      }
    }

    function checkYear(info){
        if(info.videoDetails.publishDate.startsWith("2021") || info.videoDetails.publishDate.startsWith("2020")){
            return true;
        } else {
            return false;
        }
      }

  if (checkCategory(info) && info.videoDetails.lengthSeconds < "399" && checkYear(info)){
        console.log("true");
    } else {
        console.log("false");
    }
    
  
  }



   checkTrack("https://www.youtube.com/watch?v=pGZAyVFTmcA")