require('dotenv').config()
const questions = require('../../data/questiondata.json')
const enableEndpoint = process.env.QUESTION_ENPOINT
let index = 0

const question = (req, res) => {
  if(enableEndpoint) return res.status(423).json({code: 423, message: "All questions anwered."})
  if(index >= questions.length - 1) index = 0

  res.status(200).json({code: 200, message: "Ok!", question: questions[index]})
  index++
}

module.exports = question