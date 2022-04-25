const fs = require('fs')
const db = require('../../utils/db')

const save = async (req, res) => {
  db.getTrainingData().then(data => {
    fs.writeFileSync('./data/answerdata.json', JSON.stringify(data))
  })

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 201, message: "Created!"})
}

module.exports = save