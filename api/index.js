var express = require('express')
var app = express()
require('dotenv').config()
const {API_PORT} = process.env
const ai = require('./utils/ai')

const db = require('./utils/db')
const logger = require('./utils/logger')
const postHandler = require('./utils/post-handler')
const restricted = ["/verify", "/train", "/response", "/train/save", "/signup"]

app.use((err, req, res, next) => { //print errors if happen
  logger.error(err.stack)
  res.status(500).json({code: 500, message: "Internal Server Error"})
})
app.use(require('./utils/logEndpoint').log) //log request
app.use(async (req, res, next) => { //verify token
  if(!restricted.includes(req.path.split('?')[0])) return next()
  if(await db.checkAPIToken(req.headers.token)) return next()
  res.status(401).json({code: 401, message: "Invalid Token"})
})

app.get('/ping', require('./controllers/ping'))
app.get('/changelog/:id', require('./controllers/changelog'))

app.use((req, res, next) => {
  if(req.method.toUpperCase() !== "POST") return next()
  postHandler(req, res)
}) //handle post requests

app.use((req, res, next) => res.status(404).json({code: 404, message: "Not Found!"})) //throw 404

ai.start().then(_=> {
  app.listen(API_PORT, logger.info(`Listening on http(s)://localhost:${API_PORT}/`))
})