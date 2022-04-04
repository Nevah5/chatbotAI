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

exports.getErrorMessage = (id) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT value FROM config WHERE ID='${id}'`, (err, results) => {
      if(results.length === 1) resolve(results[0].value)
      if(results.length !== 1) reject(err)
    })
  })
}

exports.setTrainingChannel = (id) => {
  return new Promise((resolve, reject) => {
    con.query(`UPDATE config SET value='${id}' WHERE ID='bot-training_channel'`)
    resolve()
  })
}

exports.addChat = (id) => {
  return new Promise((resolve, reject) => {
    con.query(`INSERT INTO chats VALUES (null, '${id}')`)
    resolve()
  })
}

exports.removeChat = (id) => {
  return new Promise((resolve, reject) => {
    con.query(`DELETE FROM chats WHERE channelId='${id}'`)
    resolve()
  })
}

exports.isChat = (id) => {
  return new Promise((resolve, reject) => {
    con.query(`SELECT * FROM chats WHERE channelId='${id}'`, (err, results) => {
      resolve(results.length === 1)
    })
  })
}