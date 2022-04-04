const { response } = require('express');
var express = require('express')
var app = express()
require('dotenv').config();
const {API_PORT} = process.env

const db = require('./src/db')

app.get('/ping', (req, res) => {
  if(req.body === undefined)
    res.send(JSON.stringify({code: 200, message: "Pong!"}))
})

app.post('/train', async (req, res) => {
  const {token} = req.headers;
  if(!await db.checkAPIToken(token)) return res.status(403).json({code: 403, message: "Not Authorized"})
  res.json({code: 200, message: "Success!"})
})

app.listen(API_PORT, console.log(`API listening on port ${API_PORT}`))