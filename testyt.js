var Reader = require('radio-song');
 
var reader = new Reader('http://degjo.zemra.org:8000/;')
   
reader.on('metadata', function(songName) {
  console.log(songName)
});