const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')
const profileModel = require('../models/profile')
const fs = require('fs')
const bcrypt = require('bcrypt')

module.exports = {
  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
        console.log('test')
      }
      console.log('tes')
      return status.badRequest(res, errors.array()[0].msg)
    }
    try {
      const data = {
        ...req.body,
        createdBy: req.userData.id,
        image: (req.file && req.file.path) || null
      }

      const initialresults = await profileModel.creatProfile(data)
      if (initialresults.affectedRows > 0) {
        const results = await profileModel.getDetailProfile(data.createdBy)
        return res.json({
          success: true,
          message: 'Profile Created',
          results
        })
      }
      return status.badRequest(res, 'Failed to create Profile')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  getProfile: async (req, res) => {
    try {
      const { id } = req.userData
      const results = await profileModel.getDetailProfile(id)
      if (results.length > 0) {
        return res.json({
          success: true,
          message: 'Profile Detail',
          results: results[0]
        })
      }
      return status.notFound(res, 'Complate your Profile')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  update: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return status.badRequest(res, errors.array()[0].msg)
    }
    try {
      const { id } = req.userData
      let { password, ...data } = req.body
      console.log(req.body)
      if (password) {
        const salt = await bcrypt.genSalt()
        const encryptedPassword = await bcrypt.hash(password, salt)
        data = {
          ...data,
          password: encryptedPassword
        }
      }

      const initialResult = await profileModel.getDetailProfile(id)
      if (initialResult.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.notFound(res, 'Profile users field not found')
      }

      if (req.file) {
        data = {
          ...data,
          image: req.file.path
        }

        if (fs.existsSync(initialResult[0].image)) {
          fs.unlinkSync(initialResult[0].image)
        }
      }

      const results = await profileModel.updateUser(id, data)
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          message: 'Profile hasbeen updated',
          result: {
            ...initialResult[0],
            ...data
          }
        })
      }
      return status.badRequest(res, 'Cannot Update Profile')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  deleteProfile: async (req, res) => {
    try {
      const { id } = req.userData
      const initialResult = await profileModel.getDetailProfile(id)
      console.log(initialResult)
      if (initialResult.length === 0) {
        return status.notFound(res, 'Profile users field not found')
      }
      if (fs.existsSync(initialResult[0].image)) {
        fs.unlinkSync(initialResult[0].image)
      }
      const results = await profileModel.deleteImage(id)
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          message: 'Profile Detail',
          results: {
            ...initialResult[0],
            image: null
          }
        })
      }
      return status.badRequest(res, 'Cannot Update Profile')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
