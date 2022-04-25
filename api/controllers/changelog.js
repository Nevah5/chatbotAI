const fs = require('fs')

const changelog = (req, res) => {
  let version = req.params.id
  if(!fs.existsSync(`./changelogs/${version}.txt`)) return res.status(400).json({code: 400, message: "Version Not Found!"})
  const data = fs.readFileSync(`./changelogs/${version}.txt`).toString()
  res.json({code: 200, message: "Ok!", changelog: data})
}

module.exports = changelog