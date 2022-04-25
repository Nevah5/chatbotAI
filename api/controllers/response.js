const ai = require('../modules/ai')

const response = (req, res) => {
  ai.run(req.headers.token, req.headers.message).then(msg => { //get response from ai
    res.status(200).json({code: 200, message: "Ok!", response: msg})
  })
}

module.exports = response