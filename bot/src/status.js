const fetch = require('node-fetch')
require('dotenv').config()

var ApiIsOnline = false;

exports.checkApi = async (user) => {
  //update bots status curresponding to apis
  await this.ping()
  this.changeStatus(user)

  //update every 30 minutes
  setInterval(_ => {
    await this.ping()
    this.changeStatus(user);
  }, 1800000)
}

//api request ping
exports.ping = _ => {
  return new Promise((resolve, reject) => {
    fetch(process.env.API + '/ping', {
      method: "GET"
    }).then(res => {
      ApiIsOnline = res.status === 200;
      resolve()
    })
    .catch(e => {
      ApiIsOnline = false;
      resolve()
    })
  })
}

//update bots profile
exports.changeStatus = (user) => {
  const production = process.env.PRODUCTION === 'true'
  if(ApiIsOnline){
    if(production) user.setAvatar('../logo.png')
    user.setStatus('online')
    user.setActivity(null)
  }else{
    if(production) user.setAvatar('../logo-api_noresponse.png')
    user.setStatus('dnd')
    user.setActivity('API DOWN')
  }
}