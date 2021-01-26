const routes = require('express').Router()
const genreController = require('../controllers/genre')
const { validationCreateGenre } = require('../helpers/validation')
const { authAdmin } = require('../middleware/auth')

routes.post('', authAdmin, validationCreateGenre, genreController.create)
routes.get('', genreController.read)
routes.get('/:id', genreController.read)
routes.delete('/:id', authAdmin, genreController.delete)
routes.patch('/:id', authAdmin, validationCreateGenre, genreController.update)

module.exports = routes
