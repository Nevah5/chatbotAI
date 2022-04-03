var express = require('express')
var app = express()

app.get('/', (req, res) => {
  res.send([1, 2, 3])
})


app.get('/response/', (req, res) => {
  res.status(404)
  res.send('Not found')
})
app.get('/user/:snowflake', (req, res) => {
  res.send(req.params.snowflake)
})

app.listen(3000)
