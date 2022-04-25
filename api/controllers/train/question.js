const questions = require('../../data/questiondata.json')

const question = (req, res) => {
  let randomQuestion = questions[Math.floor(Math.random() * questions.length)]

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 200, message: "Ok!", question: randomQuestion})
}

module.exports = question