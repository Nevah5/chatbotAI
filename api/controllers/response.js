const {spawn} = require("child_process");
const validator = require('../utils/validator')
const db = require("../utils/db")
var xmlrpc = require('xmlrpc')

const response = async (req, res) => {
  let input = req.headers.message
  if(!validator(input)) return res.status(400).json({code: 400, message: "Invalid Data!"})

  var client = xmlrpc.createClient({ host: 'localhost', port: 3001, path: '/'})
  client.methodCall('run', ['hey'], function (error, value) {
    console.log(value);

    res.status(200).json({code: 200, message: "Ok!", response: value})
    db.saveResponse(req.headers.token, input, value);
  })
}

module.exports = response