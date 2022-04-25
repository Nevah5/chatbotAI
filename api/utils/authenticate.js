const db = require('../modules/db')

exports.authenticate = async (req, res, next) => {
  let token = req.headers.token
  if(await db.checkAPIToken(token)) return next() //when token is true
  res.status(401).json({code: 401, message: "Invalid Token"})
}