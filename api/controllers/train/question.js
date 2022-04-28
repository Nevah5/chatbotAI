const questions = require('../../data/questiondata.json')
let index = 0

const question = (req, res) => {
  if(index == questions.length - 1) return res.status(423).json({code: 423, message: "Every Question answered."})

  res.status(200).json({code: 200, message: "Ok!", question: questions[index]})
  index++
}

module.exports = question