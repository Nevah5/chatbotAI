const questions = require('../../data/questiondata.json')
let index = 0

const question = (req, res) => {
  if(index >= questions.length - 1) index = 0

  res.status(200).json({code: 200, message: "Ok!", question: questions[index]})
  index++
}

module.exports = question