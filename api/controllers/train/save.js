const fs = require('fs')
const db = require('../../utils/db')

const save = async (req, res) => {
  const trainingData = []
  db.getTrainingData().then(data => {
    data.forEach(field => {
      trainingData.push({input: field.question, output: field.answer})
    });
    fs.writeFileSync('./data/answerdata.json', JSON.stringify(trainingData))
  })

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 201, message: "Created!"})
}

module.exports = save