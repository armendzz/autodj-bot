const ShoutcastTranscoder = require("shoutcast-transcoder");
const fs = require('fs');
const ytdl = require('ytdl-core');

const scTrans = new ShoutcastTranscoder({
  host: "202.61.229.127",
  port: 7799,
  username: "admin",
  password: "ZemraOrg..",
});

scTrans
  .playlistData({
    name: "main",
  })
  .then(function (response) {
    return response;
  });

//check if track exist in playlist
async function getCurrentPlaylist(param) {
  let playlista = await scTrans
    .playlistData({ name: "main" })
    .then(function (response) {
      return response.response.data.playlist.entry;
    });

  //get track name
  let info = await ytdl.getInfo(param);

  return playlista.includes('/home/webapp/autodj/music/' + info.videoDetails.title + '.mp3')
}



async function createPlaylist() {
  //get current playlist
  let playlista = await scTrans
    .playlistData({ name: "main" })
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

const IRC = require('irc-framework');


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
        }

      })

    }
  });
}


boti('auto-dj', 'Lounge');