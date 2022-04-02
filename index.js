var express = require('express')
var app = express()

app.get('/', (req, res) => {
  res.send([1, 2, 3])
})

app.listen(3000)
