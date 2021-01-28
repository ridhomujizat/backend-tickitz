const routes = require('express').Router()
const transactionController = require('../controllers/transaction')
const { authUser } = require('../middleware/auth')

routes.post('', authUser, transactionController.create)

module.exports = routes
