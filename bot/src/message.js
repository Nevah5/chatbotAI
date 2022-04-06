const fetch = require('node-fetch')
require('dotenv').config()

const embed = require('./embed')

exports.sendResponse = async msg => {
  fetch(process.env.API + '/response', {
    method: 'GET',
    headers: {
      message: msg
    }
  }).then(async res => {
    res = await res.json()
    msg.reply({embeds: [embed.messageResponse(res.message)]})
  })
}