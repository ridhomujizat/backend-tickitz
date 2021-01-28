const status = require('../helpers/errorRespon')
const transactionModel = require('../models/transaction')

module.exports = {
  create: async (req, res) => {
    try {
      const data = req.body
      console.log(data)

      // checkSchedule
      // code check schedule
      // checkseat
      data.seatSelected = typeof data.seatSelected === 'object' ? data.seatSelected : [data.seatSelected]
      const checkAvailableSeat = await transactionModel.checkSeatInSchedule(data.idSchedule, data.seatSelected)
      console.log(checkAvailableSeat)
      if (checkAvailableSeat[0].totalData > 0) {
        return status.badRequest(res, 'Seat sold, choose anothe seat')
      }

      // create transaction
      const id = req.userData.id
      const initialresults = await transactionModel.createTransaction(id)
      if (initialresults.insertId) {
        const results = await transactionModel.addItemCart(data.idSchedule, initialresults.insertId, data.seatSelected)
        if (results.affectedRows > 0) {
          return res.json({
            success: true,
            message: 'Seat Added to cart'
          })
        }
      }

      return status.badRequest(res, 'Trasaction Failed')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
