const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')
const profileModel = require('../models/profile')
const fs = require('fs')

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
          message: 'Profile Created',
          results
        })
      }
      return status.notFound(res, 'Profile has not been created')
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
      let data = req.body

      const initialResult = await profileModel.getDetailProfile(id)
      if (initialResult.length === 0) {
        if (initialResult.length === 0) {
          if (req.file) {
            fs.unlinkSync(req.file.path)
          }
          return status.notFound(res, 'Cinema selected not found')
        }
      }

      if (req.file) {
        data = {
          ...data,
          image: req.file.path
        }

        if (initialResult[0].image !== 'null') {
          fs.unlinkSync(initialResult[0].image)
        }
      }

      const results = await profileModel.updateMovie(id, data)
      console.log(initialResult)
      if (results.affectedRows > 0) {
        return res.json({
          success: true,
          message: 'Cinema hasbeen changed',
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
  }
}
