const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const pb = require('./progressbar')
const net = new brain.recurrent.LSTM()

const iterations = 200

exports.start = _ => {
  return new Promise((resolve, reject) => {
    if(fs.existsSync('./data/data.json')){
      logger.info("Network already trained.")
      //read network
      const data = fs.readFileSync('./data/data.json', 'utf-8').toString()
      net.fromJSON(JSON.parse(data))
    }else{
      logger.info("Training Network.")
      this.train()
    }
    resolve()
  })
}

exports.train = _ =>{
  if(!fs.existsSync('./data/trainingdata.json')) return reject("No trainingdata.")

  const data = JSON.parse(fs.readFileSync('./data/trainingdata.json').toString())
  let start = new Date()

  pb.render(0, start)
  //train network and render pb
  net.train(data, {
    iterations: iterations,
    log: data => {
      let iteration = data.split('iterations: ')[1].split(', ')[0]
      let percentage = 100 / iterations * parseInt(iteration)
      pb.render(percentage, start)
    }
  })
  pb.render(100, start)
  //save network
  fs.writeFileSync('./data/data.json', JSON.stringify(net.toJSON()))

  //log
  logger.info(`Training finished in ${pb.calculateReadableTime((new Date - start) / 1000)}`)
  logger.info("Wrote network to data.json")
}

exports.run = msg => {
  let filtered = msg.replace(/[^a-zA-Z.!? ]+/g, "").toLowerCase()
  console.log(filtered);
  let run = net.run(filtered)
  logger.info(`AI output: ${run}`)
  return run
}