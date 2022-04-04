const fs = require('fs')
const brain = require('brain.js')
const { networkInterfaces } = require('os')
const net = new brain.recurrent.LSTM()

var trainingData = []

exports.loadInitialTraining = () => {
  this.train(JSON.parse(fs.readFileSync('trainingdata.json')))
}

exports.loadTraining = () => {
  net.fromJSON(JSON.parse(fs.readFileSync('trainingdata.json', 'utf-8')))
  this.train(JSON.parse(fs.readFileSync('')))
}

exports.saveTraining = () => {
  fs.writeFileSync('trainingdata', JSON.stringify(net.toJSON()), (err , result) => {
    if(err) console.log("error: "+ err)
  })
}

const train = (data) => {
  console.log("Training");

  const d = new Date()

  net.train(data, {
    iterations: 2000,
    log: true,
    errorThresh: 0.001,
    logPeriod: 50,
    momentum: 0.1,
    learningRate: 0.001
  })

  this.saveTraining();

  console.log(`Finished in ${(new Date() - d) / 1000}sec`);
}