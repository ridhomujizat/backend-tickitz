const status = require('../helpers/errorRespon')
const transactionModel = require('../models/transaction')

module.exports = {
  create: async (req, res) => {
    try {
      const body = {
        ...req.body,
        createdBy: req.userData.id
      }
      console.log(body)
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
          console.log(finalresults)
          return res.json({
            success: true,
            message: 'Seat Added to cart',
            results: finalresults
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
        const splitter = result.reduce((value, item) => {
          const split = item.seatSelected.split(',')
          return [...value, ...split]
        }, [])
        return res.json({
          success: true,
          message: 'List seat sold',
          result: splitter
        })
      }
      return res.json({
        success: true,
        message: 'List seat sold',
        result: []
      })
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
      console.log(results)
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
          message: 'Flase Id Transaction'
        })
      }
      return status.notFound(res, 'Transaction Not Found')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  getOrderHistory: async (req, res) => {
    try {
      const { id } = req.userData
      console.log(id)
      const results = await transactionModel.getHistoryTransaction(id)
      if (results.length > 0) {
        return res.json({
          status: true,
          message: 'List Order History',
          results: results
        })
      }
      return res.json({
        status: true,
        message: 'List Order History',
        results: []
      })
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  updateComplatePayment: async (req, res) => {
    try {
      const { id } = req.params
      const data = {
        ...req.body,
        status: 'success'
      }
      const initialResult = await transactionModel.getdetailTransaction(id)
      console.log(initialResult.length)
      if (initialResult.length > 0) {
        const resultPayment = await transactionModel.updateTransaction(id, data)
        if (resultPayment.affectedRows > 0) {
          return res.json({
            success: true,
            message: 'Payment Success',
            result: {
              ...initialResult[0],
              ...data
            }
          })
        }
        return status.badRequest(res, 'Payment Failed')
      }
      return status.notFound(res, 'Transaction Not Found')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
