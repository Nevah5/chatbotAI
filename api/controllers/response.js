const {spawn} = require("child_process");
const validator = require('../utils/validator')

const response = async (req, res) => {
  let input = req.headers.message
  if(!validator(input)) return res.status(400).json({code: 400, message: "Invalid Data!"})

  var process = spawn('python3.7', ["./ai/chatbot.py", input]);
  process.stdout.on('data', (chunk) => {
    var textChunk = chunk.toString('utf8');

    res.status(200).json({code: 200, message: "Ok!", response: textChunk})
  });
}

module.exports = response