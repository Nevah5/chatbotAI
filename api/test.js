var spawn = require("child_process").spawn;

var process = spawn('python',["chatbot.py", "hello!"]);

process.stdout.on('data', async (chunk) => {
  var textChunk = await chunk.toString('utf8');// buffer to string

  console.log(textChunk);
});

console.log("a");