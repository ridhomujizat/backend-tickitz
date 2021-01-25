const routes = require('express').Router()
const movieController = require('../controllers/movie')
const { validationCreatMovie, validationUpdateMovie } = require('../helpers/validation')
const uploadImage = require('../helpers/uplodeImageMovie')

routes.post('', uploadImage, validationCreatMovie, movieController.create)
routes.get('', movieController.read)
routes.patch('/:id', uploadImage, validationUpdateMovie, movieController.update)
routes.delete('/:id', movieController.delete)

module.exports = routes
