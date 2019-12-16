const User = require('../models/user');

async function getUserData(login, password){
  var data = new Array();
  await User.find({username: login, password: password}, (err, res) => {
      if(err) throw err;
      data = res;
  });
  return data;
}

module.exports = {getUserData};