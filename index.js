const ShoutcastTranscoder = require("shoutcast-transcoder");
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

let mins = function(){ return Math.floor(Math.random() * 80000000) + 100000; }

let boti = function(nick, ident){

        var bot = new IRC.Client();


        bot.connect({
        host: 'web.zemra.org',
        port: 7050,
        nick: nick,
        gecos: 'Vizitore',
        username: ident,

});

bot.on('registered', function() {
    bot.join('#test');
});

bot.on('message', function(event) {

 if (event.nick === "ArmendZ" && event.message.startsWith("!deshira")) {
   

    
    event.reply(event.nick + ' Kjo Kenge egziston ne playlisten tone, ju do ta degjoni pas pak.!');
    
    }
});

}


boti('auto-dj', 'Lounge')