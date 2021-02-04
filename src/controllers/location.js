const status = require('../helpers/errorRespon')
const locationModel = require('../models/location')

module.exports = {
  getLocation: async (req, res) => {
    try {
      const result = await locationModel.getLocation()
      if (result) {
        return res.json({
          success: true,
          message: 'List Location',
          results: result
        })
      }
      return status.badRequest(res)
    } catch (err) {
      console.log(err)
      return status.badRequest(res)
    }
  }
}
