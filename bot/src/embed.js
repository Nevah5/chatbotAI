const {MessageEmbed} = require('discord.js');

exports.error = (msg) => {
  return new MessageEmbed()
  .setColor("#E94649")
  .setTitle("Something went wrong")
  .setDescription(msg)
}