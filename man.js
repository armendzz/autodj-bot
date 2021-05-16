//check if user is authorized for action
const fs = require('fs');

async function authUsers(param) {
    var userslist = await fs.readFileSync('users.txt').toString('utf-8');
    var authUsers = userslist.split('\n')
    if (authUsers.includes(param)) {
        console.log("true")
      
    } else {
        console.log("false")
      
    }
  }

  async function addUserToAuth(param) {
  fs.appendFile('users.txt', `${param}\n`, function (err) {
    if (err) return console.log(err);
    console.log('added!');
 });

  }

  authUsers("devil")