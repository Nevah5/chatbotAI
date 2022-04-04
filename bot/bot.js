const { Client, Intents, ClientPresence } = require('discord.js')
const { use } = require('express/lib/application')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
require("dotenv").config()
const fetch = require('node-fetch')

const commands = require('./src/commands')
const status = require('./src/status')
const embed = require('./src/embed')
const db = require('./src/db')

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  status.checkApi(client.user)
  commands.build(client.guilds.cache.get("960281524685660222").commands)
})

client.on('messageCreate', async msg => {
  if(msg.author.bot) return
  fetch(process.env.API + '/train/', {
    method: "POST",
    headers: {
      token: 'devToken',
      message: msg
    }
  }).then(res => {
    if(res.status === 200) msg.react('✅')
    if(res.status === 403) msg.react('❎')
  }).catch(e => {
    status.apiOffline(client.user);
    msg.reply({embeds: [embed.error(await db.getErrorMessage)]})
  })
})

client.on('interactionCreate', interaction => {
  if(interaction.isCommand()){

  }
})

client.login(process.env.DISCORD_BOT_TOKEN)