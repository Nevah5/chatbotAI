const mysql = require('mysql')
require('dotenv').config()

var con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  charset: 'utf8'
})
con.connect()

exports.checkAPIToken = token => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT token FROM apiTokens WHERE token='${token}'`, (err, result) =>{
      resolve(result.length == 1)
    })
  })
}

exports.addAPIToken = token => {
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO apiTokens (token) VALUES ('${token}')`)
    resolve()
  })
}

exports.saveMessage = (token, msg) => {
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO requests (tokenFK, msg) VALUES ((SELECT ID FROM apiTokens WHERE token='${token}'), '${msg}') RETURNING ID`, (err, results) => {
      resolve(results[0].ID)
    })
  })
}

exports.saveResponse = (id, msg) => {
  con.query(`UPDATE requests SET response='${msg}' WHERE ID=${id}`)
}

exports.addTrainingData = (q, a, ip) => {
  con.query(`INSERT INTO trainingdata (question, answer, ip) VALUES ('${q}', '${a}', '${ip}')`)
}