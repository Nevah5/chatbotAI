const fs = require('fs')
const logger = require('../utils/logger')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()
const db = require('../utils/db')

exports.start = _ => {
  return new Promise((resolve, reject) => {
    if(fs.existsSync('./data/data.json')){
      logger.info("Network already trained.")
      //read network
      const data = fs.readFileSync('./data/data.json').toString()
      net.fromJSON(JSON.parse(data))
    }else{
      logger.info("Network not trained.")
    }
    resolve()
  })
}

exports.run = async (id, input) => {
  return new Promise(async (resolve, reject) => {
    let filtered = input.replace(/[^a-zA-Z0-9!? ]/, "").toLowerCase()
    let response = net.run(filtered)

    db.saveResponse(id, response)

    resolve(response)
  })
}