const { Client, Intents } = require('discord.js')

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.GUILD_MEMBERS
  ]
})
require("dotenv").config()

const commands = require('./commands');

client.on('ready', async () => {
  console.log(`Logged in as ${client.user.tag}!`)

  //client.application.commands
  commands.build(client.guilds.cache.get("960281524685660222").commands)
})

client.on('messageCreate', msg => {
  fetch('localhost:3000/train/', {
    headers: {
      apiToken: 'devToken'
    },
    body: "",
  })
})

client.on('interactionCreate', interaction => {
  if(interaction.isCommand()){

  }
})

client.login(process.env.DISCORD_BOT_TOKEN)