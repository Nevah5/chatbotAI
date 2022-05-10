const fs = require('fs')
const db = require('../utils/db')
const validator = require('../utils/validator')

const train = (req, res) => {
  let q = req.headers.question
  let a = req.headers.answer

  if(!validator(q) || !validator(a)) return res.status(400).json({code: 400, message: "Invalid Data!"})

  db.addTrainingData(q, a, req.headers["x-forwarded-for"] || "localhost")

  res.status(200).json({code: 200, message: "Ok!"})
}

module.exports = train