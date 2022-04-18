var express = require('express')
var app = express()
const fs = require('fs')
const questions = require('./data/questiondata.json')
let port = 3001
let data = []

app.get('/question', (req, res) => {
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)]

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).json({code: 200, message: "Ok!", question: randomQuestion})
})

app.post('/train', (req, res) => {
  let question = req.headers.question
  let answer = req.headers.answer

  data.push({q: question, a: answer})

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).json({code: 200, message: "Ok!"})
})

app.get('/save', (req, res) => {
  fs.writeFileSync('data/answerdata.json', JSON.stringify(data))

  res.header("Access-Control-Allow-Origin", "*");
  res.status(200).json({code: 201, message: "Created!"})
})

app.listen(port, _ => { console.log(`Listening on port ${port} - Save data http://localhost:${port}/save`)})