const ai = require('../utils/ai')
const db = require('../utils/db')

const response = async (req, res) => {
  if(!ai.isTrained()) return res.status(500).json({code: 500, message: "Network not trained."})

  let input = req.headers.message
  let id = await db.saveMessage(req.headers.token, input)
  ai.run(id, input).then(msg => { //get response from ai
    res.status(200).json({code: 200, message: "Ok!", response: msg})
  })
}

module.exports = response