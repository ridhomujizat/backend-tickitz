const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth')

router.get('/register', authController.verivedEmail)
router.get('/forget-password', authController.verivedChangePassword)
module.exports = router
