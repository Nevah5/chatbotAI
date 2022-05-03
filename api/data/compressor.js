const fs = require('fs')
const ignore = ["answerdata.json", "data.json", "questiondata.json"]

exports.compress = _ => {
  const files = fs.readdirSync('./')
  const jsons = files.filter(file => file.endsWith('.json'))
  const compressable = jsons.filter(file => !ignore.includes(file))

  var questiondata = []
  compressable.forEach(filename => {
    var data = require(`./${filename}`)
    data.forEach(element => {
      questiondata.push(element)
    });
  });
  fs.writeFileSync('questiondata.json', JSON.stringify(questiondata))
}