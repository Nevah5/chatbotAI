const fetch = require('node-fetch')
require('dotenv').config()

const embed = require('./embed')
const db = require('./db')

var ApiIsOnline = true;

exports.checkToken = (token) => {
  fetch(process.env.API + '/verify', {
    method: "GET",
    headers: {
      token
    }
  })
  .then(res => {
    if(res.status === 401){
      console.log("The specified API token in .env is not valid.")
      process.exit(1);
    }
  })
  .catch(e => e) //ignore if api down
}

exports.checkApi = async (user, client) => {
  //update bots status curresponding to apis
  this.ping(client).catch(_ => {
    ApiIsOnline = ApiIsOnline ? false : true;
    try{
      this.changeStatus(user, client)
    }catch(e){}
  })

  //update every 30 minutes
  setInterval(_ => {
    this.ping(client).catch(_ => {
      ApiIsOnline = ApiIsOnline ? false : true;
      try{
        this.changeStatus(user, client)
      }catch(e){}
    })
  }, 5000)
}

onApiVersionChange = async (client, newApiVersion) => {
  let channel = client.guilds.cache.get(process.env.HUB_SERVER).channels.cache.get(process.env.API_CHANNEL)
  let oldApiVersion = await db.getConfigValue('api-lastversion')

  channel.send({embeds: [embed.apiVersionChange({old: oldApiVersion, new: newApiVersion})]})
  await db.updateConfigValue('api-lastversion', newApiVersion)
}

//api request ping
exports.ping = async client => {
  let lastApiVersion = await db.getConfigValue("api-lastversion")
  // console.log("Last version: "+lastApiVersion);
  return new Promise((resolve, reject) => {
    fetch(process.env.API + '/ping', {
      method: "GET"
    }).then(async res => {
      res = await res.json()
      //reject if state changed
      if(lastApiVersion !== res.version) onApiVersionChange(client, res.version)
      if(ApiIsOnline && res.status === 200) resolve()
      if(!ApiIsOnline && res.status === 200) reject()
    })
    .catch(e => { //when api is not online
      //reject if state changed
      if(!ApiIsOnline) resolve()
      if(ApiIsOnline) reject()
    })
  })
}

//update bots profile
exports.changeStatus = (user, client) => {
  let channel = client.guilds.cache.get(process.env.HUB_SERVER).channels.cache.get(process.env.API_CHANNEL)
  const production = process.env.PRODUCTION === 'true'
  if(ApiIsOnline){
    if(production) user.setAvatar('../src/logo.png')
    user.setStatus('online')
    user.setActivity(null)
    channel.send({content: `<@${process.env.OWNER_ID}>`, embeds: [embed.apiStatus("online")]})
  }else{
    if(production) user.setAvatar('../src/logo-api_noresponse.png')
    user.setStatus('dnd')
    user.setActivity('API DOWN')
    channel.send({content: `<@${process.env.OWNER_ID}>`, embeds: [embed.apiStatus("offline")]})
  }
}