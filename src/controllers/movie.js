const { APP_URL } = process.env
const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')
const movieModel = require('../models/movie')
const genreModel = require('../models/genre')
const qs = require('query-string')
const fs = require('fs')

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
      const { title } = req.body
      const body = {
        ...req.body,
        createdBy: req.userData.id,
        image: (req.file && req.file.path) || null,
        slug: title.replace(/([^\s\w])/g, '').replace(/ /g, '-').toLowerCase()
      }
      const { idGenre, ...data } = body
      const selectedGenre = []

      // Check genre available or not
      const genreCheckId = typeof idGenre === 'object' ? idGenre : [idGenre]
      const resultsCheckGenre = await genreModel.checkAllGenres(genreCheckId)
      if (resultsCheckGenre.length !== genreCheckId.length) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.notFound(res, 'Some genre are unavailable')
      } else {
        resultsCheckGenre.forEach(genre => {
          selectedGenre.push(genre.id)
        })
      }

      // Create Movie
      const initialResult = await movieModel.createMovie(data)
      if (initialResult.affectedRows > 0) {
        // add Movie Genre
        if (selectedGenre.length > 0) {
          await movieModel.createMovieGenre(initialResult.insertId, selectedGenre)
        }

        // get a movie that has just been made
        const movie = await movieModel.readMovieDetail(initialResult.insertId)
        if (movie.length > 0) {
          return res.json({
            success: true,
            message: 'Movie successfull created',
            results: movie[0]
          })
        } else {
          return status.badRequest(res, 'Failed to create Movie')
        }
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  read: async (req, res) => {
    try {
      const cond = req.query
      const query = qs.stringify({
        limit: cond.limit,
        offset: cond.offset,
        sort: cond.sort,
        order: cond.order
      })

      cond.search = cond.search || ''
      cond.page = Number(cond.page) || 1
      cond.limit = Number(cond.limit) || 5
      cond.dataLimit = cond.limit * cond.page
      cond.offset = (cond.page - 1) * cond.limit
      cond.sort = cond.sort || 'releaseDate'
      cond.order = cond.order || 'DESC'
      cond.status = cond.status || ''

      if (cond.genre) {
        const checkGenre = await genreModel.checkGenre(cond.genre)
        if (checkGenre.length === 0) {
          delete cond.genre
          // console.log(cond.genre)
        }
        cond.genre = checkGenre[0].id
        console.log('test')
      }
      // get page info
      const totalDataCheck = await movieModel.checkTotalMovieCond(cond)
      const totalPage = Math.ceil(Number(totalDataCheck[0].totalData) / cond.limit)

      // get movie list
      const results = await movieModel.readMoviebyCond(cond)

      return res.json({
        success: true,
        message: 'List all movies',
        pageInfo: {
          totalData: totalDataCheck[0].totalData,
          currentPage: cond.page,
          totalPage: totalPage,
          results,
          nextLink: (cond.search.length > 0
            ? (cond.page < totalPage ? `${APP_URL}/movies?page=${cond.page + 1}&search=${cond.search}&${query}` : null)
            : (cond.page < totalPage ? `${APP_URL}/movies?page=${cond.page + 1}&${query}` : null)),
          prevLink: (cond.search.length > 0
            ? (cond.page > 1 ? `${APP_URL}/movies?page=${cond.page - 1}&search=${cond.search}&${query}` : null)
            : (cond.page > 1 ? `${APP_URL}/movies?page=${cond.page - 1}&${query}` : null))
        }
      })
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
      const body = req.body
      let { idGenre, ...data } = body

      // get previous movie
      const initialResult = await movieModel.readMovieDetail(id)
      if (initialResult.length === 0) {
        if (req.file) {
          fs.unlinkSync(req.file.path)
        }
        return status.notFound(res, 'Movie selected Not Found')
      }

      // if wanna change image
      if (req.file) {
        data = {
          ...data,
          image: req.file.path
        }
      }

      // if wanna change title
      if (req.body.title) {
        data = {
          ...data,
          slug: req.body.title.replace(/([^\s\w])/g, '').replace(/ /g, '-').toLowerCase()
        }
      }

      // If wanna change genre
      if (idGenre) {
        const selectedGenre = []
        const genreCheckId = typeof idGenre === 'object' ? idGenre : [idGenre]

        // Check genre available or not
        const resultsCheckGenre = await genreModel.checkAllGenres(genreCheckId)
        if (resultsCheckGenre.length !== genreCheckId.length) {
          return status.notFound(res, 'Some genre are unavailable')
        } else {
          resultsCheckGenre.forEach(genre => {
            selectedGenre.push(genre.id)
          })
        }

        // change data movie genre
        await movieModel.deleteMovieGenre(id)
        await movieModel.createMovieGenre(id, selectedGenre)

        // update data movie if data found
        console.log(Object.keys(data).length)
        if (Object.keys(data).length === 0) {
          const finalResult = await movieModel.readMovieDetail(id)
          return res.json({
            success: true,
            message: 'Movie has been updated',
            results: finalResult[0]
          })
        }

        // delete previous image
        if (initialResult[0].image !== 'null') {
          fs.unlinkSync(initialResult[0].image)
        }
        const updateDataMovie = await movieModel.updateMovie(id, data)
        if (updateDataMovie.affectedRows > 0) {
          const finalResult = await movieModel.readMovieDetail(id)
          return res.json({
            success: true,
            message: 'Movie has been updated',
            results: finalResult[0]
          })
        }
      }

      // delete previous image
      if (initialResult[0].image !== 'null') {
        fs.unlinkSync(initialResult[0].image)
      }
      // Update data without genre
      const updateDataMovie = await movieModel.updateMovie(id, data)
      if (updateDataMovie.affectedRows > 0) {
        const finalResult = await movieModel.readMovieDetail(id)
        return res.json({
          success: true,
          message: 'Movie has been updated',
          results: finalResult[0]
        })
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  delete: async (req, res) => {
    try {
      const { id } = req.params

      // get movie want to delete
      const initialResult = await movieModel.readMovieDetail(id)
      if (initialResult.length === 0) {
        return status.notFound(res, 'Movie selected Not Found')
      }

      // delete previous image
      if (initialResult[0].image !== 'null') {
        fs.unlinkSync(initialResult[0].image)
      }

      const results = await movieModel.deleteMovie(id)
      if (results) {
        return res.json({
          success: true,
          message: 'Movie has been deleted',
          results: initialResult[0]
        })
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  movieByGenre: async (req, res) => {
    try {
      const { name } = req.params
      const cond = req.query
      const query = qs.stringify({
        limit: cond.limit,
        offset: cond.offset,
        sort: cond.sort,
        order: cond.order
      })

      cond.search = cond.search || ''
      cond.page = Number(cond.page) || 1
      cond.limit = Number(cond.limit) || 5
      cond.dataLimit = cond.limit * cond.page
      cond.offset = (cond.page - 1) * cond.limit
      cond.sort = cond.sort || 'id'
      cond.order = cond.order || 'ASC'

      // Check genre availble or not
      const checkGenre = await genreModel.checkGenre(name)
      if (checkGenre[0].id) {
        const totalDataCheck = await genreModel.countMovieGenre(checkGenre[0].id)
        const totalPage = Math.ceil(Number(totalDataCheck[0].totalData) / cond.limit)

        const results = await genreModel.getMovieGenre(checkGenre[0].id, cond)

        return res.json({
          success: true,
          message: 'List all movies',
          pageInfo: {
            totalData: totalDataCheck[0].totalData,
            currentPage: cond.page,
            totalPage: totalPage,
            results,
            nextLink: (cond.search.length > 0
              ? (cond.page < totalPage ? `${APP_URL}/movies/genre/${name}?page=${cond.page + 1}&search=${cond.search}&${query}` : null)
              : (cond.page < totalPage ? `${APP_URL}/movies/genre/${name}?page=${cond.page + 1}&${query}` : null)),
            prevLink: (cond.search.length > 0
              ? (cond.page > 1 ? `${APP_URL}/movies/genre/${name}?page=${cond.page - 1}&search=${cond.search}&${query}` : null)
              : (cond.page > 1 ? `${APP_URL}/movies/genre/${name}?page=${cond.page - 1}&${query}` : null))
          }
        })
      }

      return status.notFound(res, 'Genre Not Found')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  movieDetail: async (req, res) => {
    try {
      const { slug } = req.params

      const results = await movieModel.readMovieDetailSlug(slug)
      if (results.length > 0) {
        return res.json({
          success: true,
          message: 'Movie detail',
          results: results[0]
        })
      }
      return status.notFound(res, 'Movie Not Found!')
    } catch (err) {
      return status.serverError(res)
    }
  }
}
