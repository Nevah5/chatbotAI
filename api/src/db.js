const mysql = require('mysql')
require('dotenv').config()

exports.con = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: process.env.DATABASE_PORT,
  charset: 'utf8'
})
//connect to db in index.js

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