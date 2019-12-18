const User = require('../models/user');

async function getUserData(login, password){

  return await User.find({username: login, password: password}, (err, res) => {
      if(err) throw err;
      return res;
  });
}

module.exports = {getUserData};