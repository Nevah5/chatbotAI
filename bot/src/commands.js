const { config } = require("dotenv")
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
  logger.info(`New interaction (/${commandName}) from ${interaction.user.tag}`)

  switch(commandName){
    case "config":
      let subCmdGroup = interaction.options.getSubcommandGroup()
      let subCmd = interaction.options.getSubcommand()

      if(subCmdGroup === 'set') return configSetHandler(interaction)
      if(subCmdGroup === 'toggle' && subCmd === 'chat') return toggleChat(interaction)
      return configResetHandler(interaction)
  }
}

configSetHandler = interaction => {
  let subCmd = interaction.options.getSubcommand()
  switch(subCmd){
    case "training":
      isAllowed(interaction).then(async _ => {
        let channelId = interaction.channel.id;
        await db.updateConfigValue('bot-training_channel', channelId)
        interaction.editReply({embeds: [embed.success(`The training channel is\nnow <#${channelId}>!`)]})
        logger.info(`User ${interaction.user.id} ran /config set training - new channel now <#${channelId}>`)
      }).catch(_ => {
        interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
        logger.info(`User ${interaction.user.id} failed to run /config set training`)
      })
      break
    case "api-noresponse":
      break
    case "api-noresponse_status":
      break
  }
}

configResetHandler = interaction => {

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
    if(await db.isChat(channelId)){
      interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnot a chat anymore.`)]})
      logger.info(`User ${interaction.user.id} ran /config toggle chat - removed <#${channelId}>`)
      return await db.removeChat(channelId)
    }
    interaction.editReply({embeds: [embed.success(`The channel <#${channelId}> is\nnow a chat.`)]})
    db.addChat(channelId)
    logger.info(`User ${interaction.user.id} ran /config toggle chat - added <#${channelId}>`)
  }).catch(_ => {
    interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
    logger.info(`User ${interaction.user.id} failed to run /config toggle chat`)
  })
}