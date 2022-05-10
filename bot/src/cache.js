const db = require('./db')

let cache = {
  "api-noresponse_message": "",
  "api-noresponse_status": "",
  "bot-permission_role": "",
  "api-lastversion": "",
  "chats": ""
}

exports.initialize = async _ => {
  return new Promise(async (resolve, reject) => {
    cache = {
      "api-noresponse_message": await db.getConfigValue('api-noresponse_message'),
      "api-noresponse_status": await db.getConfigValue('api-noresponse_status'),
      "bot-permission_role": await db.getConfigValue('bot-permission_role'),
      "api-lastversion": await db.getConfigValue('api-lastversion'),
      "chats": await db.getChats()
    }
    resolve()
  })
}

exports.setCache = (id, value) => {
  cache[id] = value
}
exports.getCache = (id) => {
  return cache[id]
}