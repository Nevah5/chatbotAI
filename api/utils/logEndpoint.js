const logger = require('./logger')

exports.log = (req, res, next) => {
  logger.info(`${req.method.toUpperCase()} ${req.path} - ${req.headers["x-forwarded-for"] || "localhost"}`)
  next()
}