const fs = require('fs')

const handler = (req, res, next) => {
  const path = req.path.split('?')[0]

  if(!fs.existsSync(`./controllers${path}.js`)) return res.status(404).json({code: 404, message: "Not Found!"})

  require(`../controllers${path}.js`)(req, res)
}

module.exports = handler