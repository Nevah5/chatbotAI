const fetch = require('node-fetch')
require('dotenv').config()

var ApiIsOnline = true;

exports.checkApi = async (user) => {
  //update bots status curresponding to apis
  this.ping().catch(_ => {
    ApiIsOnline = ApiIsOnline ? false : true;
    this.changeStatus(user)
  })

  //update every 30 minutes
  setInterval(_ => {
    this.ping().catch(_ => {
      ApiIsOnline = ApiIsOnline ? false : true;
      this.changeStatus(user)
    })
  }, 5000)
}

//api request ping
exports.ping = _ => {
  return new Promise((resolve, reject) => {
    fetch(process.env.API + '/ping', {
      method: "GET"
    }).then(res => {
      //reject if state changed
      if(ApiIsOnline && res.status === 200) resolve()
      if(!ApiIsOnline && res.status === 200) reject()
    })
    .catch(e => {
      //reject if state changed
      if(!ApiIsOnline) resolve()
      if(ApiIsOnline) reject()
    })
  })
}

//update bots profile
exports.changeStatus = (user) => {
  const production = process.env.PRODUCTION === 'true'
  if(ApiIsOnline){
    if(production) user.setAvatar('../src/logo.png')
    user.setStatus('online')
    user.setActivity(null)
  }else{
    if(production) user.setAvatar('../src/logo-api_noresponse.png')
    user.setStatus('dnd')
    user.setActivity('API DOWN')
  }
}