const fs = require('fs')
const db = require('../utils/db')

const train = async (req, res) => {
  db.addTrainingData(req.headers.question, req.headers.answer, req.headers["x-forwarded-for"] || "localhost")

  res.status(200).json({code: 200, message: "Ok!"})
}

module.exports = train