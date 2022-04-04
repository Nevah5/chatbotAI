const { config } = require("dotenv")
const db = require('./db')
const embed = require('./embed')

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
            name: 'chat',
            description: 'Sets the chat channel where the bot interacts with the users.',
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
}

exports.handler = async interaction => {
  await interaction.deferReply({ephemeral: true})
  const {commandName} = interaction
  switch(commandName){
    case "config":
      let subCmdGroup = interaction.options.getSubcommandGroup()
      if(subCmdGroup === 'set') return configSetHandler(interaction)
      return configResetHandler(interaction)
  }
}

configSetHandler = interaction => {
  let subCmd = interaction.options.getSubcommand()
  switch(subCmd){
    case "training":
      //check if user has role or owner
      isAllowed(interaction).then(async _ => {
        let channelId = interaction.channel.id;
        await db.setTrainingChannel(channelId)
        interaction.editReply({embeds: [embed.success(`The training channel is\nnow <#${channelId}>!`)]})
      }).catch(_ => {
        interaction.editReply({embeds: [embed.error("You dont have the rights to\ndo that!")]})
      })
      break
    case "chat":
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