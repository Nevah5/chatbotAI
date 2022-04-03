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
          }
        ]
      }
    ]
  })
}