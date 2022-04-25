var express = require('express')
var app = express()
const generateApiKey = require('generate-api-key')
const fs = require('fs')
require('dotenv').config()
const {API_PORT, API_VERSION} = process.env
const ai = require('./modules/ai')
const questions = require('./data/questiondata.json')

//for manual training
let data = []
if(fs.existsSync('./data/answerdata.json')){
  let read = fs.readFileSync('./data/answerdata.json')
  data = read;
}

const db = require('./modules/db')
const logger = require('./utils/logger')
const {authenticate} = require('./utils/authenticate')
const {log} = require('./utils/logEndpoint')

app.use(log)

app.use((err, req, res, next) => {
  logger.error(err.stack)
  res.status(500).json({code: 500, message: "Internal Server Error"})
})

app.get('/ping', (req, res) => {
  res.json({code: 200, message: "Pong!", version: API_VERSION})
})
app.post('/verify', authenticate, async (req, res) => {
  res.status(200).json({code: 200, message: "Ok!"})
})
app.post('/signup', authenticate, async (req, res) => {
  let token = generateApiKey()
  await db.addAPIToken(token).then(_ => {
    logger.info(`Database - ${req.headers['x-forwarded-for'] || "localhost"} created token ${token}`)
    res.status(201).json({code: 201, message: "Created!", token: token})
  })
})
app.post('/response', authenticate, (req, res) => {
  let token = req.headers.token
  ai.run(token, req.headers.message).then(msg => { //get response from ai
    res.status(200).json({code: 200, message: "Ok!", response: msg})
  })
})
app.get('/changelog/:id', (req, res) => {
  let version = req.params.id
  if(!fs.existsSync(`./changelogs/${version}.txt`)) return res.status(404).json({code: 404, message: "Not Found!"})
  const data = fs.readFileSync(`./changelogs/${version}.txt`).toString()
  res.json({code: 200, message: "Ok!", changelog: data})
})
app.get('/train/question', (req, res) => {
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)]

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 200, message: "Ok!", question: randomQuestion})
})
app.post('/train', authenticate, async (req, res) => {
  let question = req.headers.question
  let answer = req.headers.answer

  data.push({q: question, a: answer})
  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 200, message: "Ok!"})
})
app.get('/train/save', (req, res) => {
  fs.writeFileSync('data/answerdata.json', JSON.stringify(data))

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 201, message: "Created!"})
})

ai.start().then(_=> {
  app.listen(API_PORT, logger.info(`Listening on http(s)://localhost:${API_PORT}/`))
})