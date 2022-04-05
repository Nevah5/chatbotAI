var express = require('express')
var app = express()
require('dotenv').config()
const {API_PORT} = process.env

const db = require('./src/db')

//Endpoints
app.get('/ping', (req, res) => {
  res.json({code: 200, message: "Pong!", version: process.env.API_VERSION})
})
app.get('/verify', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  }).catch(response => {
    res.status(response.code).json({code: response.code, message: response.message})
  })
})
app.post('/train', async (req, res) => {
  const {token} = req.headers
  await checkTokenPromise(token).then(_ => {
    res.status(201).json({code: 201, message: "Created!"})
  }).catch(response =>{
    res.status(response.code).json({code: response.code, message: response.message})
  })
})

//Promises
checkTokenPromise = async (token) => {
  return new Promise(async (resolve, reject) => {
    if(!await db.checkAPIToken(token)) return reject({code: 401, message: "Invalid Token."})
    resolve({code: 200, message: "Ok!"})
  })
}

app.listen(API_PORT, console.log(`API listening on port ${API_PORT}`))