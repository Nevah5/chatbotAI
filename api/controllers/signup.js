const generateApiKey = require('generate-api-key')
const db = require('../utils/db')
const logger = require('../utils/logger')

const signup = async (req, res) => {
  let token = generateApiKey()
  await db.addAPIToken(token).then(_ => {
    logger.info(`Database - ${req.headers['x-forwarded-for'] || "localhost"} created token ${token}`)
    res.status(201).json({code: 201, message: "Created!", token: token})
  })
}

module.exports = signup