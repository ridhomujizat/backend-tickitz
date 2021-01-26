const genreModel = require('../models/genre')
const { validationResult } = require('express-validator')
const status = require('../helpers/errorRespon')

module.exports = {
  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return status.badRequest(res, errors.array()[0].msg)
    }

    try {
      const data = {
        ...req.body,
        name: req.body.name.toLowerCase(),
        createdBy: req.userData.id
      }

      const checkGenre = await genreModel.checkGenre(data.name)
      if (checkGenre.length === 0) {
        const creatGenre = await genreModel.createGenre(data)
        if (creatGenre.affectedRows > 0) {
          const result = await genreModel.genreByid(creatGenre.insertId)
          if (result.length > 0) {
            return res.json({
              success: true,
              message: 'Succeess added genre.',
              results: result[0]
            })
          }
          return status.notFound(res, 'Failed to add genre!')
        }
      }
      return status.alreadyExit(res, `${checkGenre[0].name} already exit!`)
    } catch (err) {
      return status.serverError(res)
    }
  },
  read: async (req, res) => {
    try {
      const id = req.params.id || null

      const results = await genreModel.genreByid(id)
      if (results.length > 0) {
        return res.json({
          success: true,
          message: 'List Genre',
          results: results.length > 1 ? results : results[0]
        })
      }
      return status.notFound(res, 'Genre Not Found!')
    } catch (err) {
      return status.serverError(res)
    }
  },
  update: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return status.badRequest(res, errors.array()[0].msg)
    }

    try {
      const data = req.body
      const { id } = req.params

      const checkGenre = await genreModel.genreByid(id)
      if (checkGenre.length > 0) {
        genreModel.updateGenre(id, data)
        return res.json({
          success: true,
          message: 'Updata genre successfuly',
          results: {
            ...checkGenre[0],
            ...data
          }
        })
      }
      return status.notFound(res, 'Genre Not Found!')
    } catch (err) {
      return status.serverError(res)
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params

      const checkGenre = await genreModel.genreByid(id)
      if (checkGenre.length > 0) {
        genreModel.deleteGenre(id)
        return res.json({
          success: true,
          message: `${checkGenre[0].name} deleted successfully.`,
          results: checkGenre[0]
        })
      }
      return status.notFound(res, 'Genre Not Found!')
    } catch (err) {
      return status.serverError(res)
    }
  }
}
