const fetch = require('node-fetch')
require('dotenv').config()

exports.checkApi = (user) => {
  fetch(process.env.API + '/ping', {
    method: "GET"
  })
  .catch(e => {
    this.apiOffline(user)
    // user.setAvatar('../logo-api_noresponse.png');
  })
}

exports.apiOffline = (user) =>{
  user.setStatus('dnd')
  user.setActivity('API DOWN')
}
