exports.build = (commands) => {
  commands.create({
    name: 'config',
    description: 'Edit the bot\'s configuration.',
    options: [
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
            type: 'SUB_COMMAND'
          },
          {
            name: 'api-noresponse_status',
            description: 'Set the bot\'s status for when the API is down.',
            type: 'SUB_COMMAND'
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