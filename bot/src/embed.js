const {MessageEmbed} = require('discord.js');

exports.error = (msg) => {
  return new MessageEmbed()
  .setColor("#FF5F7B")
  .setTitle("Something went wrong")
  .setDescription(msg)
}