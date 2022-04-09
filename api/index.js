var express = require('express')
var app = express()
const generateApiKey = require('generate-api-key')
require('dotenv').config()
const {API_PORT, API_VERSION} = process.env
var net
const ai = require('./src/ai').start()
.then(aiNet => {
  net = aiNet
  app.listen(API_PORT, logger.info(`Listening on http(s)://localhost:${API_PORT}/`))
})

const db = require('./src/db')
const logger = require('./src/logger')

//Endpoints
app.get('/ping', (req, res) => {
  res.json({code: 200, message: "Pong!", version: API_VERSION})
  logEndpointRequest('get', 'ping', req)
})
app.post('/verify', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  }).catch(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  })
  logEndpointRequest('post', 'verify', req)
})
app.get('/signup', async (req, res) => {
  let token = generateApiKey()
  await db.addAPIToken(token).then(_ => {
    logger.info(`Database - ${req.headers['x-forwarded-for'] || "localhost"} created token ${token}`)
    res.status(201).json({code: 201, message: "Created!", token: token})
  })
  logEndpointRequest('post', 'signup', req)
})
app.post('/response', async (req, res) => {
  let token = req.headers.token
  await checkTokenPromise(token).then(_ => {
    res.status(200).json({code: 200, message: 'Hello!'})
    logger.info(`POST /response from ${req.headers['x-forwarded-for'] || "localhost"} - ${req.headers.message}`)
  }).catch(response => {
    logger.info(`POST /response from ${req.headers['x-forwarded-for'] || "localhost"} code 401`)
    res.status(response.code).json({code: response.code, message: response.message})
  })
})
app.post('/train', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(response => {
    res.status(response.code).json({code: response.code, message: response.message})
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