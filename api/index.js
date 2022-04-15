var express = require('express')
var app = express()
const generateApiKey = require('generate-api-key')
const fs = require('fs')
require('dotenv').config()
const {API_PORT, API_VERSION} = process.env
const ai = require('./src/ai')

//Start ai
ai.start().then(_=> {
  app.listen(API_PORT, logger.info(`Listening on http(s)://localhost:${API_PORT}/`))
}).catch(e => {
  logger.error(e.message)
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
    let AIResponse = ai.run(req.headers.message)
    if(AIResponse === ""){
      logger.error(`500 - Internal Server Error on endpoint /response - AI returned emtpy string`)
      return res.status(500).json({code: 500, message: "Internal Server Error!"})
    }
    res.status(200).json({code: 200, message: "Ok!", response: AIResponse})
    logger.info(`POST /response from ${req.headers['x-forwarded-for'] || "localhost"} - ${req.headers.message}`)
  }).catch(response => {
    console.log(response);
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
app.get('/changelog/:id', (req, res) => {
  let version = req.params.id
  if(!fs.existsSync(`./changelogs/${version}.txt`)) return res.status(404).json({code: 404, message: "Not Found!"})
  const data = fs.readFileSync(`./changelogs/${version}.txt`).toString()
  res.json({code: 200, message: "Ok!", changelog: data})
  logEndpointRequest('get', 'changelog', req)
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
