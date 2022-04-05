const fetch = require('node-fetch')
require('dotenv').config()

const embed = require('./embed')
const db = require('./db')
const logger = require('./logger')

var ApiIsOnline = true

//checks the token on start and exists if token is not valid
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
      process.exit(1)
    }
  })
  .catch(e => { //no response from api
    logger.warn(e.message)
  })
}

//checks api every 5 seconds and updated bot profile
exports.checkApi = async (user, client) => {
  //check api status and update bot status curresponding
  pingAndChangeStatus(user, client)
  setInterval(_ => {pingAndChangeStatus(user, client)}, process.env.API_CHECK_DELAY)
}
pingAndChangeStatus = (user, client) => {
  this.ping(client).catch(_ => {
    ApiIsOnline = ApiIsOnline ? false : true
    if(ApiIsOnline) logger.info("API is now back online!")
    if(!ApiIsOnline) logger.warn("API is now offline!")

    try{
      this.changeStatus(user, client)
    }catch(e){
      logger.error(e.message)
    }
  })
}

onApiVersionChange = async (client, newApiVersion) => {
  //get data
  let channel = client.guilds.cache.get(process.env.HUB_SERVER).channels.cache.get(process.env.API_CHANNEL)
  let oldApiVersion = await db.getConfigValue('api-lastversion')

  //send message that api version chanted
  channel.send({embeds: [embed.apiVersionChange({old: oldApiVersion, new: newApiVersion})]})
  //update last api version in database
  await db.updateConfigValue('api-lastversion', newApiVersion)
}

//ping the api
exports.ping = async client => {
  let lastApiVersion = await db.getConfigValue("api-lastversion")
  return new Promise((resolve, reject) => {
    fetch(process.env.API + '/ping', {
      method: "GET"
    }).then(async res => {
      if(ApiIsOnline && res.status === 200) resolve()
      if(!ApiIsOnline && res.status === 200) reject() //change api state to online

      //check api version
      res = await res.json()
      if(lastApiVersion !== res.version) onApiVersionChange(client, res.version)
    })
    .catch(e => { //when api is not online
      logger.warn("Ping to " + process.env.API + "/ping failed. Retrying in "+ (process.env.API_CHECK_DELAY / 1000) + " seconds.")
      if(!ApiIsOnline) resolve()
      if(ApiIsOnline) reject() //change api state to offline
    })
  })
}

//update bot's profile
exports.changeStatus = (user, client) => {
  const production = process.env.PRODUCTION === 'true'
  let channel = client.guilds.cache.get(process.env.HUB_SERVER).channels.cache.get(process.env.API_CHANNEL)
  let data = {
    pfp: ApiIsOnline ? '../src/logo.png' : '../src/logo-api_noresponse.png',
    status: ApiIsOnline ? 'online' : 'dnd',
    activity: ApiIsOnline ? null : 'API DOWN',
    apiStatusEmbed: ApiIsOnline ? 'online' : 'offline'
  }

  if(production) user.setAvatar(data.pfp) //update pfp when on production
  user.setStatus(data.status)
  user.setActivity(data.activity)
  //send information message
  channel.send({content: `<@${process.env.OWNER_ID}>`, embeds: [embed.apiStatus(data.apiStatusEmbed)]})
}