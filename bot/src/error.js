const logger = require('./logger')
const cache = require('./cache')
const db = require('./db')

exports.channelNotExists = async data => {
  logger.error(`Channel ${data.channelId} in guild ${data.guildId} doesn't exist anymore.`)
  await db.removeChat(data.channelId)
  cache.initialize() //update the cache
}