const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const pb = require('./progressbar')
const net = new brain.recurrent.LSTM()

const iterations = 2000

exports.start = _ => {
  return new Promise((resolve, reject) => {
    if(fs.existsSync('./data/data.json')){
      logger.info("Network already trained.")
      const data = fs.readFileSync('./data/data.json').toString()
      net.fromJSON(JSON.parse(data))
    }else{
      logger.info("Training Network.")
      if(!fs.existsSync('./data/trainingdata.json')) return reject("No trainingdata.")
      const data = JSON.stringify(fs.readFileSync('./data/trainingdata.json').toString())
      let start = new Date()
      pb.render(0, start)
      net.train(data, {
        iterations: iterations,
        log: data => {
          let iteration = data.split('iterations: ')[1].split(', ')[0]
          let percentage = 100 / iterations * parseInt(iteration)
          pb.render(percentage, start)
        }
      })
      pb.render(100, start)
      fs.writeFileSync('./data/data.json', JSON.stringify(net.toJSON()))
      logger.info(`Training finished in ${pb.calculateReadableTime((new Date - start) / 1000)}`)
      logger.info("Wrote network to data.json")
    }
    resolve()
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