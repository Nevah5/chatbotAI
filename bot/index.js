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
const cache = require('./src/cache')
const message = require('./src/message')
const db = require('./src/db')
const api = require('./src/api')
const logger = require('./src/logger')
const {HUB_SERVER, API_TOKEN, DISCORD_BOT_TOKEN} = process.env

//check the token
api.checkToken(API_TOKEN)

client.on('ready', async () => {
  await cache.initialize() //wait for cache to load
  logger.info(`Logged in as ${client.user.tag}!`)

  api.checkApi(client.user, client)
  commands.build(client.guilds.cache.get(HUB_SERVER).commands)
})

client.on('messageCreate', async msg => {
  if(msg.author.bot) return
  if(await db.isChat(msg.channel.id)) message.sendResponse(msg)
})

client.on('interactionCreate', interaction => {
  try{
    if(interaction.isCommand()) commands.handler(interaction, client)
  }catch(e){
    logger.error(e)
  }
})

client.login(DISCORD_BOT_TOKEN)