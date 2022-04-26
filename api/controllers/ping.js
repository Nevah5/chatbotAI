require('dotenv').config()

const ping = (req, res) => {
  res.json({code: 200, message: "Pong!", version: process.env.API_VERSION})
}

module.exports = ping