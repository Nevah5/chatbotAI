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

exports.apiStatus = (status) => {
  let color = {
    online: "#33BA6B",
    offline: "#E94649"
  }
  let messages = {
    online: "The API is now back online.",
    offline: "The API is offline."
  }
  return new MessageEmbed()
  .setTitle("API Status update")
  .setColor(color[status])
  .setDescription(messages[status])
  .setTimestamp()
}

exports.apiVersionChange = (data) => {
  return new MessageEmbed()
  .setTitle("API Version change")
  .setDescription(`The version of the API\nchanged from ${data.old}\nto ${data.new}.`)
  .setColor("#3FBA54")
  .setTimestamp()
}

exports.chatAPIstatusUpdate = (message, col) => {
  let color = ["#33BA6B", "#E94649"]
  return new MessageEmbed()
  .setTitle("API Status update")
  .setColor(color[col ? 0 : 1])
  .setDescription(message)
  .setTimestamp()
}