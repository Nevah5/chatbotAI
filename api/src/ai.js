const fs = require('fs')
const logger = require('./logger')
const brain = require('brain.js')
const pb = require('./progressbar')
const net = new brain.recurrent.LSTM()
const db = require('./db')

const iterations = 10000


exports.start = _ => {
  return new Promise((resolve, reject) => {
    if(fs.existsSync('./data/data.json')){
      logger.info("Network already trained.")
      //read network
      const data = fs.readFileSync('./data/data.json').toString()
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

const responses = require('../data/responses.json')
const getResponse = group => {
  if(group === -1) return "I dont know how to respond."
  let groupResponses = responses[group]
  return groupResponses[Math.floor(Math.random() * groupResponses.length)]
}

exports.run = async (token, msg) => {
  return new Promise(async (resolve, reject) => {
    let reqId = await db.saveMessage(token, msg)

    let filtered = msg.replace(/[^a-zA-Z.!? ]+/g, "").toLowerCase()
    let run = net.run(filtered) || -1

    db.saveResponse(reqId, run) //update response field in db
    resolve(getResponse(run))
  })
}