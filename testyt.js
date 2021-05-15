const ytdl = require('ytdl-core');



async function tracktitle(){
    let videoID = "https://www.youtube.com/watch?v=oT8amicWUBA"
    let info = await ytdl.getInfo(videoID);
    console.log(info.videoDetails.title)
}

tracktitle()