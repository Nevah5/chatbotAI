const fs = require("fs");
const prompt = require('prompt-sync')();

arr = JSON.parse(fs.readFileSync('questiondata.json').toString())
do{
  var i = prompt(">>> ");
  if(i != "q" && i !== null) arr.push(i)
} while (i != "q");

fs.writeFileSync('questiondata.json', JSON.stringify(arr))
