const ShoutcastTranscoder = require("shoutcast-transcoder");
const fs = require('fs');
const ytdl = require('ytdl-core');
const { exec } = require("child_process");
const IRC = require('irc-framework');
const playlistpath = '/home/armendz/radio/autodj/playlists/newmain.lst'
const trackspath = '/home/armendz/radio/autodj/downloadedmuzik/'

const scTrans = new ShoutcastTranscoder({
  host: "149.202.20.88",
  port: 7799,
  username: "admin",
  password: "ZemraOrg..",
});

scTrans
  .playlistData({
    name: "newmain",
  })
  .then(function (response) {
    return response;
  });

//check if track exist in playlist
async function getCurrentPlaylist(param) {
  /*  let playlista = await scTrans
     .playlistData({ name: "newmain" })
     .then(function (response) {
       return response.response.data.playlist.entry;
     }); */
  var text = await fs.readFileSync(playlistpath).toString('utf-8');
  var playlista = text.split('\n')
  //get track name
  let info = await ytdl.getInfo(param);

  if (playlista.includes(trackspath + info.videoDetails.title + '.mp3' || trackspath + info.videoDetails.title + '/' + info.videoDetails.title + '.mp3')) {
    return "mire";
  } else {
    return info.videoDetails.title;
  }

}


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
  return "true";
  } else {
    return "false";
  }
  

}


async function createPlaylist(param) {
  // exec('find /home/armendz/radio/autodj/downloadedmuzik -type f -name "*.mp3" > /home/armendz/radio/autodj/playlists/newmain.lst')
  //get current playlist
  /* 
  let playlista = await scTrans
    .playlistData({ name: "newmain" })
    .then(function (response) {
      return response.response.data.playlist.entry;
    }); */

  var text = await fs.readFileSync(playlistpath).toString('utf-8');
  var playlista = text.split('\n')
  //get current track
  let currentSong = await scTrans.getStatus().then(function (response) {
    return response.response.data.status.activesource.currenttrack;
  });

  let newSong = trackspath + param + ".mp3";


  let newPlaylist = [];

  let currentsongnr = playlista.indexOf(currentSong);
  let playedSond = playlista.slice(0, currentsongnr + 1);
  let nextSongs = playlista.slice(playedSond.length, playlista.length);


  newPlaylist.push(newSong);
  for (i = 0; i < nextSongs.length; i++) {
    newPlaylist.push(nextSongs[i]);
  }
  for (i = 0; i < playedSond.length; i++) {
    newPlaylist.push(playedSond[i]);
  }

  /*  console.log("current playlist")
   console.log(playlista)
   console.log("currentsongnr")
   console.log(currentsongnr)
   console.log("nextSongs")
   console.log(nextSongs)
   console.log("playedSond")
   console.log(playedSond) */
  /* console.log(newPlaylist) */

  const writeStream = fs.createWriteStream(playlistpath);
  //const writeStream = fs.createWriteStream('file.txt');
  const pathName = writeStream.path;

  newPlaylist.forEach(value => writeStream.write(`${value}\n`));

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
    //reload playlist
    exec("sh refresh.sh")
  });

  // handle the errors on the write process
  writeStream.on('error', (err) => {
    console.error(`There is an error writing the file ${pathName} => ${err}`)
  });

  // close the stream
  writeStream.end();
}



let boti = function (nick, ident) {

  var bot = new IRC.Client();
  bot.connect({
    host: 'web.zemra.org',
    port: 7050,
    nick: nick,
    gecos: 'Vizitore',
    username: ident,
  });

  bot.on('registered', function () {
    bot.join('#armendz');
  });

  bot.on('message', function (event) {
    if (event.nick === "ArmendZ" && event.message.startsWith("!deshira")) {
      let words = event.message.split(' ');
      let ytUrl = words[1];
      // TODO - check if words[1] exist
      getCurrentPlaylist(ytUrl).then(function (responsee) {
        if (responsee == "mire") { 
          event.reply(event.nick + ' Kenga qe e keni keruar egziston ne playlisten tonë.') 
        }  else {
          checkTrack(ytUrl).then(function (oko) {
            if (oko == "true") {
              event.reply(event.nick + ' Kenga qe keni kerkuar do te shtohet ne playlisten tone dhe ju do ta ndegjoni pas pak.')
              exec(`youtube-dl --extract-audio --audio-format mp3 --output "${trackspath}%(title)s.%(ext)s" ${ytUrl}`, (error, stdout, stderr) => {
                if (error) {
                  console.log(`error: ${error.message}`);
                  event.reply(event.nick + " Kenga qe keni kerkuar nuk mund te gjendet ne serveret e YouTube, jutem korigjoni linkun dhe provoni perseri")
               
                }
                if (stderr) {
                  console.log(`stderr: ${stderr}`);
                  event.reply(event.nick + " Kenga qe keni kerkuar nuk mund te gjendet ne serveret e YouTube, jutem korigjoni linkun dhe provoni perseri")
                 
                }
                if (!error && !stderr) {
                  // create new playlist and pass new track name
                  console.log(responsee)
                  createPlaylist(responsee)
                }
              })
            } else {
              event.reply(event.nick + ' Kenga qe keni kerkuar nuk i plotson kushtet paraprake per tu shtuar ne playlist, kenga duhet te mos jet me e vjeter se 2020 dhe te mos jet me e gjate se 399 seconda')
            }
          })
        }
      })
    }

    if (event.message == "!deshira") {
      event.reply(event.nick + ' Per te shtuar kenge ne playlisten tone ju duhet te keni nick te regjistruar dhe ta shenoni ne formatin: !deshira youtube-link, me shume ndihme merni duke shkruar: !autodj')
    }

    if (event.message == "!autodj") {
      event.reply(event.nick + ' Ndihme reth Autodj: Ju mund te shtoni kenge ne playlisten tone duke perdorur komanden: !deshira linku-youtube. Per te shtuar kenge ju duhet ti plotsoni disa kushte')
      event.reply('1. Nick i regjistruar 2. Kenga te mos jet me e vjeter se viti 2020 3. Kenga duhet nga zhanri: Music ose Entertaiment (Komendi ose humor nuk lejohen) 4. Kenga nuk duhet te jete me e gjate se 399 seconda')
    }
  });

}


boti('auto-dj', 'Lounge');

