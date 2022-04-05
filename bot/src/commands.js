const db = require('./db')
const embed = require('./embed')
var logger = require('./logger')

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
            name: 'training',
            description: 'Sets the training channel for the bot.',
            type: 'SUB_COMMAND'
          },
          {
            name: 'api-noresponse',
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
                name: 'id',
                description: 'The ID of the role.',
                type: 'STRING',
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
            name: 'api-noresponse',
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
  logger.debug(`Successfully built all commands.`)
}

exports.handler = async interaction => {
  await interaction.deferReply({ephemeral: true})
  const {commandName} = interaction

  switch(commandName){
    case "config":
      let subCmd = interaction.options.getSubcommand()
      if(subCmd === 'show') return //fun()

      let subCmdGroup = interaction.options.getSubcommandGroup()
      if(subCmdGroup === 'set') return configSetHandler(interaction)
      if(subCmdGroup === 'toggle' && subCmd === 'chat') return toggleChat(interaction)
      if(subCmdGroup === 'reset') return //fun()
      break
  }
}

configSetHandler = async interaction => {
  switch(interaction.options.getSubcommand()){
    case "training":
      await isAllowed(interaction).then(async _ => { //if user is owner or has bot role
        let channelId = interaction.channel.id
        await db.updateConfigValue('bot-training_channel', channelId)

        interaction.editReply({embeds: [embed.success(`The training channel is\nnow <#${channelId}>!`)]})
        logger.info(`${getUserMessage(interaction)} ran ${getCommandMessage(interaction)} - new channel now ${getChannelMessage(interaction)}`)
      }).catch(_ => { //if user is not allowed to run command
        interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
        logger.info(`${getUserMessage(interaction)} failed to run ${getCommandMessage(interaction)}`)
      })
      break
    case "api-noresponse":
      break
    case "api-noresponse_status":
      break
  }
}

isAllowed = interaction => {
  return new Promise((resolve, reject) => {
    if(interaction.user.id === process.env.OWNER_ID) return resolve()
    if(interaction.member.roles.cache.filter(role => role.id === process.env.BOT_ROLE_ID).size === 1) return resolve()
    reject()
  })
}

toggleChat = async interaction => {
  isAllowed(interaction).then(async _ => {
    let channelId = interaction.channel.id

    if(await db.isChat(channelId)) {
      interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnot a chat anymore.`)]})
      logger.info(`${getUserMessage(interaction)} ran ${getCommandMessage(interaction)} - removed ${getChannelMessage(interaction)}`)
      return await db.removeChat(channelId)
    }
    interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnow a chat.`)]})
    db.addChat(channelId)
    logger.info(`${getUserMessage(interaction)} ran ${getCommandMessage(interaction)} - added ${getChannelMessage(interaction)}`)
  }).catch(_ => {
    interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
    logger.info(`${getUserMessage(interaction)} failed to run ${getCommandMessage(interaction)}`)
  })
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