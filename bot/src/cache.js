const db = require('./db')

let cache = {
  "api-noresponse_message": "",
  "api-noresponse_status": "",
  "bot-permission_role": "",
  "api-lastversion": "",
  "bot-training_channel": "",
  "chats": ""
}

exports.initialize = async _ => {
  cache = {
    "api-noresponse_message": await db.getConfigValue('api-noresponse_message'),
    "api-noresponse_status": await db.getConfigValue('api-noresponse_status'),
    "bot-permission_role": await db.getConfigValue('bot-permission_role'),
    "api-lastversion": await db.getConfigValue('api-lastversion'),
    "bot-training_channel": await db.getConfigValue('bot-training_channel'),
    "chats": await db.getChats()
  }
}

exports.setCache = (id, value) => {
  cache[id] = value
}
exports.getCache = (id) => {
  return cache[id]
}