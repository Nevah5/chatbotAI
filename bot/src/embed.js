const {MessageEmbed} = require('discord.js')

exports.error = (msg) => {
  return new MessageEmbed()
  .setColor("#E94649")
  .setTitle("Something went wrong")
  .setDescription(msg)
}

exports.success = (msg) => {
  return new MessageEmbed()
  .setColor("#3FBA54")
  .setTitle("Success!")
  .setDescription(msg)
}