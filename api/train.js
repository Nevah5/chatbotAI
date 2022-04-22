const fs = require('fs')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()
const logger = require('./utils/logger')
const pb = require('./utils/progressbar')

var iterations = 5000

if(!fs.existsSync('./data/answerdata.json')){
  logger.error("No data (answerdata.json)")
  process.exit(1)
}

var trainingdata = []

const answerdata = require('./data/answerdata.json')
answerdata.forEach(data => {
  trainingdata.push({input: data.q, output: data.a})
})

let startedDate = new Date
net.train(trainingdata, {
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
logger.info(`Finished training in ${(new Date - startedDate) / 1000}s`)

fs.writeFileSync('./data/data.json', JSON.stringify(net.toJSON()))