const fs = require('fs')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()
const logger = require('./utils/logger')
const pb = require('./utils/progressbar')
require('dotenv').config()

var iterations = process.env.AI_ITERATIONS

if(!fs.existsSync('./data/answerdata.json')){
  logger.error("No data (answerdata.json)")
  process.exit(1)
}

if(fs.existsSync('./data/data.json')){
  logger.error("Network already trained")
  process.exit(1)
}

const answerdata = require('./data/answerdata.json')

let startedDate = new Date
net.train(answerdata, {
  log: data => {
    //convert to object
    let iteration = data.split("iterations: ")[1].split(",")[0]
    let trainingError = data.split("error: ")[1]
    let d = {iteration: iteration, "training error": trainingError}
    //render pb
    pb.render(d, startedDate, iterations)
  },
  iterations
})

pb.finished(startedDate)
logger.info(`Finished training in ${pb.calculateReadableTime(new Date - startedDate)}`)

fs.writeFileSync('./data/data.json', JSON.stringify(net.toJSON()))