const routes = require('express').Router()
const transactionController = require('../controllers/transaction')
const { authUser } = require('../middleware/auth')

routes.post('', authUser, transactionController.create)
routes.get('/order-history/', authUser, transactionController.getOrderHistory)
routes.get('/:id', authUser, transactionController.getTransactionDetail)
routes.get('/seat/:id', transactionController.readSeatSold)
routes.patch('/:id', authUser, transactionController.updateComplatePayment)
module.exports = routes
