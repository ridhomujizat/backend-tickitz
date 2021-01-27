const showTimeModel = require('../models/showTime')
const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')

module.exports = {
  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return status.badRequest(res, errors.array()[0].msg)
    }
    try {
      const { time } = req.body
      const data = {
        time,
        createdBy: req.userData.id
      }

      if (time.split(':').length !== 3) {
        return status.badRequest(res, 'Time must be HH:MM:SS')
      }

      const initialResult = await showTimeModel.createShowTime(data)
      console.log(initialResult)
      if (initialResult.affectedRows > 0) {
        const result = await showTimeModel.getShowTimeById(initialResult.insertId)
        return res.json({
          success: true,
          message: 'Time created successfully',
          results: result[0]
        })
      }
      return status.testApp(res)
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  read: async (req, res) => {
    try {
      const results = await showTimeModel.getTime()
      console.log(results)
      if (results.length > 0) {
        return res.json({
          success: true,
          message: 'List times',
          results
        })
      }
      return status.notFound(res, 'Times Not Found')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  update: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return status.badRequest(res, errors.array()[0].msg)
    }
    try {
      const { id } = req.params
      const { time } = req.body

      const initialResult = await showTimeModel.getShowTimeById(id)
      if (initialResult.length < 1) {
        return status.badRequest(res, 'Time selected Not Found')
      }

      const result = await showTimeModel.updateShowTime(id, { time })
      if (result.affectedRows > 0) {
        return res.json({
          success: true,
          message: 'Time has been updated',
          results: {
            ...initialResult[0],
            time: time
          }
        })
      }
      return status.badRequest(res, 'Failed to update time')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
