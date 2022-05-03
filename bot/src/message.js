const fetch = require('node-fetch')

const api = require('./api')
const cache = require('./cache')
const embed = require('./embed')

exports.sendResponse = async msg => {
  if(!api.isApiOnline() && msg.author.id === process.env.OWNER_ID) return
  if(!api.isApiOnline()) msg.delete()
  if(!api.isApiOnline()) return msg.author.send({embeds: [embed.error(cache.getCache('api-noresponse_message'))]})
  if(msg.content === "") return msg.delete()
  await msg.channel.sendTyping()
  //move this fetch into api.js
  await fetch(process.env.API + '/response', {
    method: 'POST',
    headers: {
      token: process.env.API_TOKEN,
      message: msg
    }
  }).then(async res => {
    if(res.status === 401) return msg.reply({embeds: [embed.error("The API token is not valid.")]})
    if(res.status === 500) return msg.reply({embeds: [embed.error("Internal API Error.")]})
    res = await res.json()
    msg.reply({content: res.response})
  }).catch(res => {
    msg.reply({embeds: [embed.error("The API did not respond.")]})
  })
}