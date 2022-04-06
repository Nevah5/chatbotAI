var express = require('express')
var app = express()
const generateApiKey = require('generate-api-key')
require('dotenv').config()
const {API_PORT} = process.env

const db = require('./src/db')
const logger = require('./src/logger')

//Endpoints
app.get('/ping', (req, res) => {
  res.json({code: 200, message: "Pong!", version: process.env.API_VERSION})
  logEndpointRequest('get', 'ping', req)
})
app.get('/verify', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  }).catch(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  })
  logEndpointRequest('get', 'verify', req)
})
app.get('/signup', async (req, res) => {
  let token = generateApiKey()
  await db.addAPIToken(token).then(_ => {
    logger.info(`Database - ${req.headers['x-forwarded-for'] || "localhost"} created token ${token}`)
    res.status(201).json({code: 201, message: "Created!", token: token})
  })
  logEndpointRequest('post', 'signup', req)
})
app.post('/train', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(_ => {
    res.status(201).json({code: 201, message: "Created!"})
  }).catch(response =>{
    res.status(response.code).json({code: response.code, message: response.message})
  })
  logEndpointRequest('post', 'train', req)
})

//Log templates
logEndpointRequest = (method, endpoint, req) => {
  logger.info(`${method.toUpperCase()} /${endpoint} from ${req.headers['x-forwarded-for'] || "localhost"}`)
}

//Promises
checkTokenPromise = async (token) => {
  return new Promise(async (resolve, reject) => {
    if(!await db.checkAPIToken(token)) return reject({code: 401, message: "Invalid Token."})
    resolve({code: 200, message: "Ok!"})
  })
}

app.listen(API_PORT, logger.info(`Listening on http(s)://localhost:${API_PORT}/`))