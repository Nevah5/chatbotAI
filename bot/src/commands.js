const { MessageEmbed } = require('discord.js')
var logger = require('./logger')
const db = require('./db')
const api = require('./api')
const embed = require('./embed')
const cache = require('./cache')
const { ExceptionHandler } = require('winston')

exports.build = (commands) => {
  commands.create({
    name: 'config',
    description: 'Edit the bot\'s configuration.',
    options: [
      {
        name: 'show',
        description: 'Show the current configuration of the bot.',
        type: 'SUB_COMMAND'
      },
      {
        name: 'toggle',
        description: '...',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            name: 'chat',
            description: 'Sets the chat channel where the bot interacts with the users.',
            type: 'SUB_COMMAND'
          }
        ]
      },
      {
        name: 'set',
        description: '...',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            name: 'api-noresponse_message',
            description: 'Set the message for when the API is down.',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'value',
                description: 'The message content for when the API is down and a user writes with the bot.',
                type: "STRING",
                required: true
              }
            ]
          },
          {
            name: 'api-noresponse_status',
            description: 'Set the bot\'s status for when the API is down.',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'value',
                description: 'The bot\'s activity status message.',
                type: "STRING",
                required: true
              }
            ]
          },
          {
            name: 'bot-permission_role',
            description: 'Change the role with which you are allowed to use the bot\'s commands.',
            type: 'SUB_COMMAND',
            options: [
              {
                name: 'role',
                description: 'The role which should have permission to all commands.',
                type: 'ROLE',
                required: true
              }
            ]
          }
        ]
      },
      {
        name: 'reset',
        description: '...',
        type: 'SUB_COMMAND_GROUP',
        options: [
          {
            name: 'api-noresponse_message',
            description: 'Reset the message for when the API is down.',
            type: 'SUB_COMMAND'
          },
          {
            name: 'api-noresponse_status',
            description: 'Reset the bot\'s status for when the API is down.',
            type: 'SUB_COMMAND'
          }
        ]
      }
    ]
  })
  commands.create({
    name: 'broadcast',
    description: 'Broadcast something to every chat.',
    options: [
      {
        name: 'message',
        description: 'The message you want to broadcast.',
        type: 'STRING',
        required: true
      }
    ]
  })
  logger.debug(`Successfully built all commands.`)
}

exports.handler = async (interaction, client) => {
  const {commandName} = interaction

  switch(commandName){
    case "config":
      await interaction.deferReply({ephemeral: true})
      isAllowed(interaction).then(async _ => {
        let subCmd = interaction.options.getSubcommand()
        if(subCmd === 'show') return showConfig(interaction)

        let subCmdGroup = interaction.options.getSubcommandGroup()
        if(subCmdGroup === 'reset') return configResetHandler(interaction, client)
        if(subCmdGroup === 'set') return configSetHandler(interaction, client)
        if(subCmdGroup === 'toggle' && subCmd === 'chat') return toggleChat(interaction)
      }).catch(async e => {
        interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
        logger.info(`${getUserMessage(interaction)} failed to run ${getCommandMessage(interaction)} in ${getChannelMessage(interaction)}`)
      })
      break
    case "broadcast":
      await interaction.deferReply({ephemeral: true})
      isAllowed(interaction).then(async _ => {
        let chats = cache.getCache('chats')
        chats.forEach(chat => {
          let channel = client.guilds.cache.get(chat.guildId).channels.cache.get(chat.channelId)
          if(typeof channel == "object"){
            channel.send({embeds: [embed.broadcastMessage(interaction)]})
          }else{ //delete channel if not existing anymore
            error.channelNotExists(chat)
          }
        })
        interaction.editReply({embeds: [embed.success("Broadcast sent!")]})
      }).catch(async e => {
        interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
        logger.info(`${getUserMessage(interaction)} failed to run ${getCommandMessage(interaction)} in ${getChannelMessage(interaction)}`)
      })
  }
}

configResetHandler = async (interaction, client) => {
  let cmd = interaction.options.getSubcommand()
  let defaultConfigs = {
    "api-noresponse_message": 'The API is currently not online.\nPlease have patience while the\nissue is getting resolved.',
    "api-noresponse_status": 'API DOWN'
  }

  switch(cmd){
    case "api-noresponse_message":
      await db.updateConfigValue('api-noresponse_message', defaultConfigs["api-noresponse_message"])
      cache.setCache('api-noresponse_message', defaultConfigs["api-noresponse_message"])
      break
      case "api-noresponse_status":
        await db.updateConfigValue('api-noresponse_status', defaultConfigs["api-noresponse_status"])
        cache.setCache('api-noresponse_status', defaultConfigs["api-noresponse_status"])
        if(!api.isApiOnline()) client.user.setActivity(defaultConfigs["api-noresponse_status"])
      break
  }
  let defaultConfigEscaped = (defaultConfigs[cmd]).replace(/(\r\n|\n|\r)/gm, '\\n')
  logger.info(`${getUserMessage(interaction)} reset configuration ${cmd} to ${defaultConfigEscaped}`)
  interaction.editReply({embeds: [embed.success(`Successfully reset\n\`${cmd}\`\nto:\n\n${defaultConfigs[cmd]}`)]})
}

configSetHandler = async (interaction, client) => {
  switch(interaction.options.getSubcommand()){
    case "api-noresponse_message":
      let newMessage = interaction.options.getString("value")
      await db.updateConfigValue('api-noresponse_message', newMessage)
      cache.setCache('api-noresponse_message', newMessage)
      interaction.editReply({embeds: [embed.success(`Successfully updated the\nresponse message to:\n\n${newMessage}`)]})
      break
    case "api-noresponse_status":
      let newStatus = interaction.options.getString("value")
      await db.updateConfigValue('api-noresponse_status', newStatus)
      cache.setCache('api-noresponse_status', newStatus)
      if(!api.isApiOnline()) client.user.setActivity(newStatus)
      interaction.editReply({embeds: [embed.success(`Successfully updated the\nstatus to:\n\n${newStatus}`)]})
      break
    case "bot-permission_role":
      let newRole = interaction.options.getRole('role')
      await db.updateConfigValue('bot-permission_role', newRole.id)
      cache.setCache('bot-permission_role', newRole.id)
      interaction.editReply({embeds: [embed.success(`Successfully changed the\nrole to <@&${newRole.id}>!`)]})
      break
  }
}

showConfig = async (interaction) => {
  let api_version = cache.getCache('api-lastversion')
  let api_Noresponse = cache.getCache('api-noresponse_message')
  let api_NoresponseStatus = cache.getCache('api-noresponse_status')
  let botRoleId = cache.getCache('bot-permission_role')
  let chats = cache.getCache('chats')

  let overviewEmbed = new MessageEmbed()
  .setTitle("Config Overview")
  .addFields(
    {
      name: 'API Version',
      value: api_version
    },
    {
      name: 'API Outage bot status',
      value: api_NoresponseStatus
    },
    {
      name: 'API Outage user info message',
      value: api_Noresponse
    },
    {
      name: 'Permission Role',
      value: `<@&${botRoleId}>`
    }
  )
  if(chats.length >= 1) overviewEmbed.addField("Chats", chats.map(chat => ` <#${chat.channelId}>`).toString())
  interaction.editReply({embeds: [overviewEmbed]})
}


isAllowed = async interaction => {
  return new Promise(async (resolve, reject) => {
    let roleId = cache.getCache('bot-permission_role')
    if(interaction.user.id === process.env.OWNER_ID) return resolve()
    if(interaction.member.roles.cache.filter(role => role.id === roleId).size === 1) return resolve()
    reject()
  })
}

toggleChat = async interaction => {
  let channelId = interaction.channel.id

  if(await db.isChat(channelId)) {
    interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnot a chat anymore.`)]})
    logger.info(`${getUserMessage(interaction)} ran ${getCommandMessage(interaction)} - removed ${getChannelMessage(interaction)}`)
    return await db.removeChat(channelId)
  }
  interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnow a chat.`)]})
  db.addChat(channelId, interaction.guild.id)
  logger.info(`${getUserMessage(interaction)} ran ${getCommandMessage(interaction)} - added ${getChannelMessage(interaction)}`)
}

getChannelMessage = interaction => {
  return `#${interaction.channel.name} (${interaction.channel.id})`
}
getUserMessage = interaction => {
  return `User ${interaction.user.tag} (${interaction.user.id})`
}
getCommandMessage = (interaction) => {
  try{
    return "/" + interaction.commandName +
      (" " + interaction.options.getSubcommandGroup() + " ") +
      interaction.options.getSubcommand()
  }catch{
    try{
      return "/" + interaction.commandName + " " +
        interaction.options.getSubcommand()
    }catch{
      return "/" + interaction.commandName
    }
  }
}