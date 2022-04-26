const db = require('./db')

let cache = {
  "api-noresponse_message": "",
  "api-noresponse_status": "",
  "bot-permission_role": "",
  "api-lastversion": "",
  "chats": ""
}

exports.initialize = async _ => {
  return new Promise((resolve, reject) => {
    let conf1 = await db.getConfigValue('api-noresponse_message')
    let conf2 = await db.getConfigValue('api-noresponse_status')
    let conf3 = await db.getConfigValue('bot-permission_role')
    let conf4 = await db.getConfigValue('api-lastversion')
    let conf5 = await db.getChats()
    cache = {
      "api-noresponse_message": conf1,
      "api-noresponse_status": conf2,
      "bot-permission_role": conf3,
      "api-lastversion": conf4,
      "chats": conf5
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