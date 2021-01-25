const routes = require('express').Router()
const genreController = require('../controllers/genre')
const { validationCreateGenre } = require('../helpers/validation')

routes.post('', validationCreateGenre, genreController.create)
routes.get('', genreController.read)
routes.get('/:id', genreController.read)
routes.delete('/:id', genreController.delete)
routes.patch('/:id', validationCreateGenre, genreController.update)

module.exports = routes
