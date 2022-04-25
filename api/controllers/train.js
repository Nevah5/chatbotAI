const fs = require('fs')
const db = require('../modules/db')

const train = async (req, res) => {
  db.addTrainingData(req.headers.question, req.headers.answer, req.headers["x-forwarded-for"] || "localhost")

  res.header("Access-Control-Allow-Origin", "*")
  res.status(200).json({code: 200, message: "Ok!"})
}

module.exports = train