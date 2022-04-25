const fs = require('fs')

const save = (req, res) => {
  fs.writeFileSync('data/answerdata.json', JSON.stringify(data))

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 201, message: "Created!"})
}

module.exports = save