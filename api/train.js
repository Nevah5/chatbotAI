const fs = require('fs')
const brain = require('brain.js')
const net = new brain.recurrent.LSTM()
const logger = require('./utils/logger')

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
net.train(trainingdata, {log: true, iterations: 5000})

logger.info(`Finished training in ${(new Date - startedDate) / 1000}s`)

fs.writeFileSync('./data/data.json', JSON.stringify(net.toJSON()))