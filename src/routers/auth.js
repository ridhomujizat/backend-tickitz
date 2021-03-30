const routes = require('express').Router()
const authController = require('../controllers/auth')

routes.post('/login', authController.login)
routes.post('/register', authController.register)
routes.post('/forget-password', authController.forgetPassword)

module.exports = routes
