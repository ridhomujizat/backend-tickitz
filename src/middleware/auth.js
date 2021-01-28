const jwt = require('jsonwebtoken')
const { APP_KEY } = process.env

exports.authAdmin = (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    const token = authorization.substr(7)
    const data = jwt.verify(token, APP_KEY)

    if (data.role === 'ADMIN') {
      req.userData = data
      return next()
    }
  }
  return res.status(401).json({
    success: false,
    message: 'Admin authorization needed'
  })
}
exports.authUser = (req, res, next) => {
  const { authorization } = req.headers
  if (authorization && authorization.startsWith('Bearer')) {
    const token = authorization.substr(7)
    const data = jwt.verify(token, APP_KEY)
    console.log(data)
    if (data) {
      req.userData = data
      return next()
    }
  }
  return res.status(401).json({
    success: false,
    message: 'User authorization needed'
  })
}
