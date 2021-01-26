const { APP_KEY } = process.env
const status = require('../helpers/errorRespon')
const userModel = require('../models/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      const existingUser = await userModel.getUserByCondition({ email })
      console.log(existingUser)
      if (existingUser.length > 0) {
        const compare = await bcrypt.compare(password, existingUser[0].password)
        if (compare) {
          const { id, role } = existingUser[0]
          const token = jwt.sign({ id, role }, APP_KEY)
          return res.json({
            success: true,
            message: 'Login successfully',
            token
          })
        }
      }

      return status.unauthorized(res, 'Worng Email and Password ')
    } catch (err) {
      return status.serverError(res)
    }
  },
  register: async (req, res) => {
    try {
      const { email, password } = req.body

      // check email
      const checkEmail = await userModel.getUserByCondition({ email })
      if (checkEmail.length > 0) {
        return status.unauthorized(res, `${checkEmail[0].email} has been used`)
      }

      // create email
      const salt = await bcrypt.genSalt()
      const encryptedPassword = await bcrypt.hash(password, salt)
      const createUser = await userModel.createUser({ email, password: encryptedPassword })
      if (createUser.insertId) {
        return res.json({
          success: true,
          message: 'register success!'
        })
      } else {
        return status.unauthorized(res, 'Register Failed')
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
