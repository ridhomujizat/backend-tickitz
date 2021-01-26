const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')
const fs = require('fs')
const cinemaModel = require('../models/cinema')
const locationModel = require('../models/location')
module.exports = {
  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      if (req.file) {
        fs.unlinkSync(req.file.path)
      }
      return status.badRequest(res, errors.array()[0].msg)
    }

    try {
      const data = {
        ...req.body,
        createdBy: req.userData.id,
        image: (req.file && req.file.path) || null
      }

      // chek location
      if (!data.location) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.badRequest(res, 'Location is required')
      }
      const checkLocation = await locationModel.getLocation(data.location)
      console.log(checkLocation)
      if (checkLocation.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.notFound(res, 'Location Not Found')
      }

      const initialResult = await cinemaModel.createCinemas(data)
      console.log(initialResult)
      if (initialResult.affectedRows > 0) {
        const result = await cinemaModel.getCinemasById(initialResult.insertId)
        console.log(result)
        if (result.length > 0) {
          return res.json({
            success: true,
            message: 'Cinemas successfull created',
            results: result[0]
          })
        } else {
          return status.badRequest(res, 'Failed to create Cinemas')
        }
      }
      console.log(data)
      return status.testApp(res)
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
      const { id } = req.params
      let data = req.body

      const initialResult = await cinemaModel.getCinemasById(id)
      if (initialResult.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.notFound(res, 'Cinema selected not found')
      }

      if (data.location) {
        if (data.location) {
          const checkLocation = await locationModel.getLocation(data.location)
          if (checkLocation.length === 0) {
            if (req.file) {
              fs.unlinkSync(req.file.path)
            }
            return status.notFound(res, 'Location Not Found')
          }
        }
      }

      if (req.file) {
        data = {
          ...data,
          image: req.file.path
        }

        // delete previous image
        if (initialResult[0].image !== 'null') {
          fs.unlinkSync(initialResult[0].image)
        }
      }

      const results = await cinemaModel.updateCinema(id, data)
      if (results.affectedRows) {
        return res.json({
          success: true,
          message: 'Cinema hasbeen changed',
          result: {
            ...initialResult[0],
            ...data
          }
        })
      }
      return status.testApp(res)
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params

      const initialResult = await cinemaModel.getCinemasById(id)
      if (initialResult.length === 0) {
        return status.notFound(res, 'Cinema selected not found')
      }

      const results = await cinemaModel.deleteCinema(id)
      if (results.affectedRows > 0) {
        if (initialResult[0].image !== 'null') {
          fs.unlinkSync(initialResult[0].image)
        }
        return res.json({
          success: true,
          message: 'Cinemas deleted successfuly',
          results: initialResult[0]
        })
      }

      return status.testApp(res)
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
