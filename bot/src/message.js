const fetch = require('node-fetch')

const api = require('./api')
const db = require('./db')
const embed = require('./embed')

exports.sendResponse = async msg => {
  if(!api.isApiOnline()) return msg.reply({embeds: [embed.error(await db.getConfigValue('api-noresponse_message'))]})
  msg.channel.sendTyping()
  //move this fetch into api.js
  await fetch(process.env.API + '/response', {
    method: 'POST',
    headers: {
      token: process.env.API_TOKEN,
      message: msg
    }
  }).then(async res => {
    if(res.status === 401) return msg.reply({embeds: [embed.error("The API token is not valid.")]})
    res = await res.json()
    msg.reply({content: res.message})
  }).catch(res => {
    msg.reply({embeds: [embed.error("The API did not respond.")]})
  })
}