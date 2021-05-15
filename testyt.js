const ShoutcastTranscoder = require("shoutcast-transcoder");
const fs = require('fs');
const ytdl = require('ytdl-core');
const { exec } = require("child_process");

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
  let playlista = await scTrans
    .playlistData({ name: "newmain" })
    .then(function (response) {
        console.log(response.response.data.playlist.entry)
      return response.response.data.playlist.entry;
    });

  //get track name
  let info = await ytdl.getInfo(param);

  return playlista.includes('/home/armendz/radio/autodj/downloadedmuzik/' + info.videoDetails.title + '.mp3')
}

getCurrentPlaylist("https://www.youtube.com/watch?v=wqIMMksm6Zk")

async function createPlaylist() {
  //get current playlist
  let playlista = await scTrans
    .playlistData({ name: "newmain" })
    .then(function (response) {
      return response.response.data.playlist.entry;
    });

  //get current track
  let currentSong = await scTrans.getStatus().then(function (response) {
    return response.response.data.status.activesource.currenttrack;
  });


  let newSong = "/home/webapp/autodj/music/ferdez.mp3";


  let newPlaylist = [];

  let currentsongnr = playlista.indexOf(currentSong);
  let nextSongs = playlista.slice(currentsongnr + 1, playlista.length);
  let playedSond = playlista.slice(0, currentsongnr + 1);

  newPlaylist.push(newSong);

  for (i = 0; i < nextSongs.length; i++) {
    newPlaylist.push(nextSongs[i]);
  }
  for (i = 0; i < playedSond.length; i++) {
    newPlaylist.push(playedSond[i]);
  }

  console.log(newPlaylist)
}
/*  const IRC = require('irc-framework');


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
    bot.join('#test');
  });

  bot.on('message', function (event) {
    if (event.nick === "ArmendZ" && event.message.startsWith("!deshira")) {
      let words = event.message.split(' ');
      let ytUrl = words[1];
      getCurrentPlaylist(ytUrl).then(function (response) {
        if (response) { event.reply(event.nick + ' Kenga qe e keni keruar egziston ne playlisten tonë.') }
        else {
          event.reply(event.nick + ' Kenga qe keni kerkuar do te shtohet ne playlisten tone dhe ju do ta ndegjoni pas pak.')
          exec(`youtube-dl --extract-audio --audio-format mp3 --output "/home/armendz/radio/autodj/downloadedmuzik/%(title)s.%(ext)s" ${ytUrl}`, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            console.log(`stdout: ${stdout}`);
        })
        }
      })
    }
  });
}


boti('auto-dj', 'Lounge'); 
 */ 

// komanda per ta shkarkuar mp3
// youtube-dl --extract-audio --audio-format mp3 --output "/home/armendz/radio/autodj/downloadedmuzik/%(uploader)s%(title)s.%(ext)s" https://www.youtube.com/watch\?v\=nEvoPpTn6Wo