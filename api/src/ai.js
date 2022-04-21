const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()

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