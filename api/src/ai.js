const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const pb = require('./progressbar')
const net = new brain.recurrent.LSTM()

const iterations = 20000

exports.start = _ => {
  return new Promise((resolve, reject) => {
    if(fs.existsSync('./data/data.json')){
      logger.info("Network already trained.")
      const data = fs.readFileSync('./data/data.json').toString()
      net.fromJSON(JSON.stringify(data))
    }else{
      logger.info("Training Network.")
      let start = new Date()
      net.train([
        'hello', 'wonderful', 'amazing', 'wow', 'crazy',
        'hello', 'wonderful', 'amazing', 'wow', 'crazy',
        'hello', 'wonderful', 'amazing', 'wow', 'crazy',
        'hello', 'wonderful', 'amazing', 'wow', 'crazy',
      ],{
        iterations: iterations,
        log: data => {
          let iteration = data.split('iterations: ')[1].split(', ')[0]
          let percentage = 100 / iterations * parseInt(iteration)
          pb.render(percentage, start)
        }
      })
      pb.render(100, start)
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