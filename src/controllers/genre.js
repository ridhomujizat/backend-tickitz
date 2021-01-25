const modulGenre = require('../models/genre')
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
        name: req.body.name.toLowerCase()
      }

      const checkGenre = await modulGenre.checkGenre(data.name)
      if (checkGenre.length === 0) {
        const creatGenre = await modulGenre.createGenre(data)
        console.log(creatGenre)
        if (creatGenre.affectedRows > 0) {
          const result = await modulGenre.genreByid(creatGenre.insertId)
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

      const results = await modulGenre.genreByid(id)
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

      const checkGenre = await modulGenre.genreByid(id)
      if (checkGenre.length > 0) {
        modulGenre.updateGenre(id, data)
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

      const checkGenre = await modulGenre.genreByid(id)
      if (checkGenre.length > 0) {
        modulGenre.deleteGenre(id)
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
