const fetch = require('node-fetch')
require('dotenv').config()

exports.checkApi = (user) => {
  fetch(process.env.API + '/ping', {
    method: "GET"
  })
  .catch(e => {
    this.apiOffline(user)
  })
}

exports.apiOffline = (user) =>{
  user.setStatus('dnd')
  user.setActivity('API DOWN')
}
