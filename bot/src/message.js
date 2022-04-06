const fetch = require('node-fetch')
require('dotenv').config()

const api = require('./api')
const db = require('./db')
const embed = require('./embed')

exports.sendResponse = async msg => {
  if(!api.isApiOnline()) return msg.reply({embeds: [embed.error(await db.getConfigValue('api-noresponse_message'))]})
  msg.channel.sendTyping()
  //move this fetch into api.js
  await fetch(process.env.API + '/response', {
    method: 'GET',
    headers: {
      message: msg
    }
  }).then(async res => {
    res = await res.json()
    msg.reply({content: res.message})
  }).catch(_ => {
    msg.reply({embeds: [embed.error("The API did not respond.")]})
  })
}