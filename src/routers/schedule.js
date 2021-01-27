const routes = require('express').Router()
const scheduleController = require('../controllers/schedule')
const { authAdmin } = require('../middleware/auth')
const { validationCreateSchedule } = require('../helpers/validation')

routes.post('', authAdmin, validationCreateSchedule, scheduleController.create)
routes.get('', scheduleController.read)

module.exports = routes
