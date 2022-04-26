const mysql = require('mysql')
require('dotenv').config()

var config = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  charset: 'utf8'
}


exports.checkAPIToken = token => {
  return new Promise((resolve, reject) => {
    let con = mysql.createConnection(config)
    con.connect()
    con.query(`SELECT token FROM apiTokens WHERE token='${token}'`, (err, result) =>{
      resolve(result.length == 1)
    })
    con.end()
  })
}

exports.addAPIToken = token => {
  return new Promise((resolve, reject) => {
    let con = mysql.createConnection(config).connect()
    con.query(`INSERT INTO apiTokens (token) VALUES ('${token}')`)
    resolve()
    con.end()
  })
}

exports.saveMessage = (token, msg) => {
  return new Promise((resolve, reject) => {
    let con = mysql.createConnection(config).connect()
    con.query(`INSERT INTO requests (tokenFK, msg) VALUES ((SELECT ID FROM apiTokens WHERE token='${token}'), '${msg}') RETURNING ID`, (err, results) => {
      resolve(results[0].ID)
    })
    con.end()
  })
}

exports.saveResponse = (id, msg) => {
  let con = mysql.createConnection(config).connect()
  con.query(`UPDATE requests SET response='${msg}' WHERE ID=${id}`)
  con.end()
}

exports.addTrainingData = (question, answer, ipAdress) => {
  let q = question.replace(/[\\$'"]/g, "\\$&")
  let a = answer.replace(/[\\$'"]/g, "\\$&")
  let ip = ipAdress.replace(/[\\$'"]/g, "\\$&")
  let con = mysql.createConnection(config).connect()
  con.query(`INSERT INTO trainingdata (question, answer, ip) VALUES ('${q}', '${a}', '${ip}')`)
  con.end()
}

exports.getTrainingData = _ => {
  return new Promise((resolve, reject) => {
    let con = mysql.createConnection(config).connect()
    con.query(`SELECT question, answer FROM trainingdata`, (err, data) => {
      resolve(data)
    })
    con.end()
  })
}