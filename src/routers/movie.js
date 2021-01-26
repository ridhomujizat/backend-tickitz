const routes = require('express').Router()
const movieController = require('../controllers/movie')
const { validationCreatMovie, validationUpdateMovie } = require('../helpers/validation')
const { authAdmin } = require('../middleware/auth')
const uploadImage = require('../helpers/uplodeImageMovie')

routes.post('', authAdmin, uploadImage, validationCreatMovie, movieController.create)
routes.get('', movieController.read)
routes.patch('/:id', authAdmin, uploadImage, validationUpdateMovie, movieController.update)
routes.delete('/:id', authAdmin, movieController.delete)
routes.get('/genre/:name', movieController.movieByGenre)

module.exports = routes
