const routes = require('express').Router()
const showTimeController = require('../controllers/showTime')
const { authAdmin } = require('../middleware/auth')
const { validateShowTime } = require('../helpers/validation')

routes.patch('/:id', authAdmin, validateShowTime, showTimeController.update)
routes.post('', authAdmin, validateShowTime, showTimeController.create)
routes.get('', authAdmin, showTimeController.read)

module.exports = routes
