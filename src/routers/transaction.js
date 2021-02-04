const routes = require('express').Router()
const transactionController = require('../controllers/transaction')
const { authUser } = require('../middleware/auth')

routes.post('', authUser, transactionController.create)
routes.get('/:id', authUser, transactionController.getTransactionDetail)
routes.get('/seat/:id', transactionController.readSeatSold)

module.exports = routes
