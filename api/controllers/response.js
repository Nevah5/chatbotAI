const ai = require('../utils/ai')
const db = require('../utils/db')

const response = (req, res) => {
  let input = req.headers.message
  let id = db.saveResponse(req.headers.token, input)
  ai.run(id, input).then(msg => { //get response from ai
    res.status(200).json({code: 200, message: "Ok!", response: msg})
  })
}

module.exports = response