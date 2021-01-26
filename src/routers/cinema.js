const routes = require('express').Router()
const cinemaController = require('../controllers/cinemas')
const { validationCreateCinema } = require('../helpers/validation')
const uploadImage = require('../helpers/uplodeImageCinema')
const { authAdmin } = require('../middleware/auth')

routes.patch('/:id', authAdmin, uploadImage, validationCreateCinema, cinemaController.update)
routes.post('', authAdmin, uploadImage, validationCreateCinema, cinemaController.create)
routes.delete('/:id', authAdmin, cinemaController.delete)

module.exports = routes
