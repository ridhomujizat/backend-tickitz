const status = require('../helpers/errorRespon')
const transactionModel = require('../models/transaction')

module.exports = {
  create: async (req, res) => {
    try {
      const body = {
        ...req.body,
        createdBy: req.userData.id
      }
      // checkSchedule
      // code check schedule
      // checkseat
      body.seatSelected = typeof body.seatSelected === 'object' ? body.seatSelected : [body.seatSelected]
      const checkAvailableSeat = await transactionModel.checkSeatInSchedule(body.idSchedule, body.seatSelected)
      console.log(checkAvailableSeat)
      if (checkAvailableSeat[0].totalData > 0) {
        return status.badRequest(res, 'Seat sold, choose anothe seat')
      }

      const { seatSelected, idSchedule, ...data } = body
      const initialresults = await transactionModel.createTransaction(data)
      console.log(initialresults)
      if (initialresults.insertId) {
        const results = await transactionModel.addItemCart(idSchedule, initialresults.insertId, body.seatSelected)
        if (results.affectedRows > 0) {
          const finalresults = await transactionModel.getdetailTransaction(initialresults.insertId)
          return res.json({
            success: true,
            message: 'Seat Added to cart',
            results: finalresults[0]
          })
        }
      }

      return status.badRequest(res, 'Trasaction Failed')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  readSeatSold: async (req, res) => {
    try {
      const { id } = req.params
      console.log(id)
      const result = await transactionModel.readsSeatSold(id)
      if (result.length > 0) {
        return res.json({
          success: true,
          message: 'List seat sold',
          result
        })
      }
      return status.notFound(res, 'Not seat selectred')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  getTransactionDetail: async (req, res) => {
    try {
      const { id } = req.params
      const { statusPayment } = req.query

      const results = await transactionModel.getdetailTransaction(id, statusPayment)
      if (results.length > 0) {
        if (results[0].createdBy === req.userData.id) {
          return res.json({
            status: true,
            message: 'Transaction detail',
            results: results[0]
          })
        }
        return res.status(401).json({
          success: false,
          message: 'User s needed'
        })
      }
      return status.notFound(res, 'Transaction Not Found')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
