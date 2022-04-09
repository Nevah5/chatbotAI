const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()

exports.start = _ => {
  return new Promise((resolve, reject) => {
    //check if trained
    if(fs.existsSync('trained.json')){
      //read trained data
      fs.readFileSync('trained.json', (err, data) => {
        net.fromJSON(JSON.parse(data.toString()))
      })
    }else{
      //else train algo
      this.train()
    }
    //resolve trained network
    resolve(net)
  })
}

exports.train = _ =>{
  let started = new Date()
  logger.info("Started AI training process")
  //read trainingdata and train network
  fs.readFileSync('trainingdata.json', (err, data) => {
    array = data.toString().split('.')
    net.train(array, {
      iterations: 1,
      log: true,
      errorThresh: 0.01
    }).then(_ =>{
      fs.writeFileSync('trained.json', JSON.stringify(net.toJSON()))

      logger.info(`Finished training AI in ${(new Date() - started) / 1000} seconds`)
    })
  })
}