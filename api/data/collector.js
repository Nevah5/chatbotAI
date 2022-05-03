const fs = require("fs");
const prompt = require('prompt-sync')();

arr = []
do{
  var i = prompt(">>> ");
  if(i != "q" && i !== null) arr.push(i)
} while (i != "q");

var filename = prompt("File name >>> ")
fs.writeFileSync(filename+".json", JSON.stringify(arr))

require('./compressor').compress() //compress all files to single file
