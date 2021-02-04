const routes = require('express').Router()
const locationController = require('../controllers/location')

routes.get('', locationController.getLocation)

module.exports = routes
