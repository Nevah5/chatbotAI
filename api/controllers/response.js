const {spawn} = require("child_process");
const validator = require('../utils/validator')
const db = require("../utils/db")
var xmlrpc = require('xmlrpc')
require('dotenv').config()

const response = async (req, res) => {
  let input = req.headers.message
  if(!validator(input)) return res.status(400).json({code: 400, message: "Invalid Data!"})

  //TODO: filter input
  var client = xmlrpc.createClient({ host: process.env.XMLRPC_HOST, port: process.env.XMLRPC_PORT, path: '/'})
  client.methodCall('run', input, function (error, value) {
    res.status(200).json({code: 200, message: "Ok!", response: value})
    db.saveResponse(req.headers.token, input, value);
  })
}

module.exports = response