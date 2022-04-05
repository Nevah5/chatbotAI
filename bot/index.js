const { Client, Intents, ClientPresence, Application } = require('discord.js')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
require("dotenv").config()

const commands = require('./src/commands')
const embed = require('./src/embed')
const db = require('./src/db')
const api = require('./src/api')
const logger = require('./src/logger')

//check the token
api.checkToken(process.env.API_TOKEN)

client.on('ready', async () => {
  logger.info(`Logged in as ${client.user.tag}!`)

  api.checkApi(client.user, client)
  commands.build(client.guilds.cache.get(process.env.HUB_SERVER).commands)
})

// client.on('messageCreate', async msg => {
//   if(msg.author.bot) return
//   fetch(process.env.API + '/train/', {
//     method: "POST",
//     headers: {
//       token: 'devToken',
//       message: msg
//     }
//   }).then(res => {
//     if(res.status === 200) msg.react('✅')
//   }).catch(async e => {
//     msg.reply({embeds: [embed.error(await db.getConfigValue('api-noresponse'))]})
//   })
// })

client.on('interactionCreate', interaction => {
  if(interaction.isCommand()) commands.handler(interaction)
})

client.login(process.env.DISCORD_BOT_TOKEN)