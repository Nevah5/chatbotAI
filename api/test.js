const {spawn} = require("child_process");

var process = spawn('python3.7', ["./ai/chatbot.py", "hello"]);

process.stdout.on('data', (chunk) => {
  var textChunk = chunk.toString('utf8');

  console.log(textChunk);
});
