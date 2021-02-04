const routes = require('express').Router()
const { authUser } = require('../middleware/auth')
const { validateProfile, validateupdateProfile } = require('../helpers/validation')
const profileController = require('../controllers/profile')
const uploadImage = require('../helpers/uploadProfile')

routes.post('', authUser, uploadImage, validateProfile, profileController.create)
routes.patch('', authUser, uploadImage, validateupdateProfile, profileController.update)
routes.get('', authUser, profileController.getProfile)

module.exports = routes
