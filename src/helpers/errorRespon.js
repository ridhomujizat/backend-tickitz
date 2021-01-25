module.exports = {
  notFound: (res, message) => {
    return res.status(404).json({
      success: false,
      message: message
    })
  },
  badRequest: (res, message) => {
    return res.status(400).json({
      success: false,
      message: message
    })
  },
  alreadyExit: (res, message) => {
    return res.status(409).json({
      success: false,
      message: message
    })
  },
  testApp: (res, item) => {
    return res.json({
      success: true,
      data: item
    })
  },
  serverError: (res) => {
    return res.status(500).json({
      success: false,
      message: 'Server error, please contact the administrator'
    })
  }
}
