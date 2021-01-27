const status = require('../helpers/errorRespon')
const { validationResult } = require('express-validator')
const movieModel = require('../models/movie')
const cinemaModel = require('../models/cinema')
const seatTypeModel = require('../models/seatType')
const showTimeModel = require('../models/showTime')
const scheduleModel = require('../models/schedule')

module.exports = {
  create: async (req, res) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return status.badRequest(res, errors.array()[0].msg)
    }
    try {
      const data = { ...req.body, createdBy: req.userData.id }
      console.log(data)

      // Check date type
      if (data.date.split('-').length !== 3) {
        return status.badRequest(res, 'Date Type must be YYYY:MM:DD')
      }
      // Check Slected Movie Availabel or not
      const movieCheck = await movieModel.readMovieDetail(data.idMovie)
      if (movieCheck < 1) {
        return status.notFound(res, 'Selected Movie Not Found')
      }
      // Check Slected Movie Availabel or not
      const cinemaCheck = await cinemaModel.getCinemasById(data.idCinema)
      if (cinemaCheck < 1) {
        return status.notFound(res, 'Selected Cinema Not Found')
      }
      // Check seat Movie Availabel or not
      const seatTYpeCheck = await seatTypeModel.getSeatTypeById(data.seatType)
      if (seatTYpeCheck < 1) {
        return status.notFound(res, 'Selected seat type Not Found')
      }
      // Check showTime Availabel or not
      const idTime = typeof data.idTime === 'object' ? data.idTime : [data.idTime]
      const checkIdTime = await showTimeModel.checkAllShowTime(idTime)
      if (checkIdTime[0].totalData !== idTime.length) {
        return status.badRequest(res, 'Some Time not availble')
      }

      // create schedule
      const results = await scheduleModel.createSchedule(data)
      // ubah ini nnti jika tanggalnya mau inputbanyak
      // results.affectedRows > date.legth * checkIdTime[0].totalData
      if (results.affectedRows === checkIdTime[0].totalData) {
        res.json({
          success: true,
          message: `Schedule For Movie ${movieCheck[0].title} created successfully`
        })
      }
      return status.badRequest(res, `Schedule For Movie ${movieCheck[0].title} failed to create`)
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  read: async (req, res) => {
    try {
      console.log(req.query)
      const { idMovie, ...cond } = req.query

      // cond.page = Number(cond.page) || 1
      // cond.limit = Number(cond.limit) || 5
      // cond.dataLimit = cond.limit * cond.page
      // cond.offset = (cond.page - 1) * cond.limit

      const results = await scheduleModel.getScheduleByMovie(idMovie, cond)
      console.log(results)
      // Get Cinema uniq
      const filterCinema = Object.values(results.reduce((unique, item) => {
        if (!unique[item.idCinema]) {
          unique[item.idCinema] = ({
            idCinema: item.idCinema,
            name: item.name,
            image: item.image,
            address: item.address,
            price: item.price,
            location: item.location,
            date: item.date,
            showTime: results.filter((item) => item.idCinema === item.idCinema)
              .map(({ id, time, seat }) => ({ id, time, seat }))
          })
        }

        return unique
      }, {}))
      if (results.length > 1) {
        return res.json({
          success: true,
          message: `List Schedule ${results[0].title}`,
          results: {
            idMovie: results[0].idMovie,
            title: results[0].title,
            cinema: filterCinema
          }
        })
      }
      return status.testApp(res)
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
