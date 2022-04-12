const fetch = require('node-fetch')

const embed = require('./embed')
const cache = require('./cache')
const db = require('./db')
const logger = require('./logger')

var ApiIsOnline = true

//checks the token on start and exists if token is not valid
exports.checkToken = (token) => {
  fetch(process.env.API + '/verify', {
    method: "POST",
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
    if(!ApiIsOnline) logger.error("API is now offline!")

    try{
      changeStatus(user, client)
    }catch(e){
      logger.error(e.message)
    }
  })
}

//ping the api
exports.ping = async client => {
  let lastApiVersion = cache.getCache('api-lastversion')
  return new Promise((resolve, reject) => {
    let startPing = new Date()
    fetch(process.env.API + '/ping', {
      method: "GET"
    }).then(async res => {
      logger.debug(`Successfully pinged API in ${(new Date - startPing)}ms`)
      if(!ApiIsOnline && res.status === 200) return reject() //change api state to online

      if(ApiIsOnline && res.status === 200) resolve()
      //check api version
      res = await res.json()
      if(lastApiVersion !== res.version) onApiVersionChange(client, res.version)
    })
    .catch(e => { //when api is not online
      logger.debug("Ping to " + process.env.API + "/ping failed. Retrying in "+ (process.env.API_CHECK_DELAY / 1000) + " seconds.")
      if(!ApiIsOnline) return resolve()
      if(ApiIsOnline) reject() //change api state to offline
    })
  })
}

onApiVersionChange = async (client, newApiVersion) => {
  fetch(process.env.API + `/changelog/${newApiVersion}`, {
    method: "GET"
  }).then(async res => {
    let data = {changelog: "- [ NO CHANGELOG FOUND ]"}
    if(res.status === 200) data = await res.json()

    let oldApiVersion = cache.getCache('api-lastversion')
    const chats = cache.getCache("chats")
    chats.forEach(chat => {
      let channel = client.guilds.cache.get(chat.guildId).channels.cache.get(chat.channelId)
      channel.send({embeds: [embed.apiVersionChange({old: oldApiVersion, new: newApiVersion, changelog: data.changelog})]})
    });

    //update last api version in database
    await db.updateConfigValue('api-lastversion', newApiVersion)
    cache.setCache('api-lastversion', newApiVersion)
  })
}

//update bot's profile
changeStatus = async (user, client) => {
  const production = process.env.PRODUCTION === 'true'
  let channel = client.guilds.cache.get(process.env.HUB_SERVER).channels.cache.get(process.env.API_CHANNEL)
  let data = {
    pfp: ApiIsOnline ? '../src/logo.png' : '../src/logo-api_noresponse.png',
    status: ApiIsOnline ? 'online' : 'dnd',
    activity: ApiIsOnline ? null : cache.getCache('api-noresponse_status'),
    apiStatusEmbed: ApiIsOnline ? 'online' : 'offline'
  }

  if(production) user.setAvatar(data.pfp) //update pfp when on production
  user.setStatus(data.status)
  user.setActivity(data.activity)
  //send information message
  channel.send({content: `<@${process.env.OWNER_ID}>`, embeds: [embed.apiStatus(data.apiStatusEmbed)]})
  //send embed in every chat channel
  let chats = await db.getChats()
  let apiNoResponseMessage = cache.getCache('api-noresponse_message')
  let apiBackOnlineMessage = "The API is back online."
  let message = ApiIsOnline ? apiBackOnlineMessage : apiNoResponseMessage
  chats.forEach(chat => {
    let channel = client.guilds.cache.get(chat.guildId).channels.cache.get(chat.channelId)
    channel.send({embeds: [embed.chatAPIstatusUpdate(message, ApiIsOnline)]})
  })
}

exports.isApiOnline = _ => {
  return ApiIsOnline;
}