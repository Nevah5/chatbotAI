const ai = require('../utils/ai')
const db = require('../utils/db')
const validator = require('../utils/validator')

const response = async (req, res) => {
  if(!ai.isTrained()) return res.status(500).json({code: 500, message: "Network not trained."})

  let input = req.headers.message
  if(!validator(input)) return res.status(400).json({code: 400, message: "Invalid Data!"})
  ai.run(req.headers.token, input).then(msg => { //get response from ai
    res.status(200).json({code: 200, message: "Ok!", response: msg})
  })
}

module.exports = response