const { APP_KEY, CLIENT_URL } = process.env
const status = require('../helpers/errorRespon')
const userModel = require('../models/auth')
const profileModel = require('../models/profile')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const mailer = require('../helpers/mailer')

module.exports = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body

      const existingUser = await userModel.getUserByCondition({ email })

      if (existingUser.length > 0) {
        const compare = await bcrypt.compare(password, existingUser[0].password)
        if (compare) {
          if (existingUser[0].email_verified_at === null) {
            return status.unauthorized(res, 'your account has not been activated, please check email your email')
          }
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
      const { device } = req.query

      // check email
      const checkEmail = await userModel.getUserByCondition({ email })
      if (checkEmail.length > 0) {
        return status.unauthorized(res, `${checkEmail[0].email} has been used.`)
      }

      // create email
      const salt = await bcrypt.genSalt()
      const encryptedPassword = await bcrypt.hash(password, salt)
      const createUser = await userModel.createUser({ email, password: encryptedPassword })
      if (createUser.insertId) {
        const createProfile = await profileModel.creatProfile({ createdBy: createUser.insertId })
        if (createProfile.insertId) {
          const user = await userModel.getUserByCondition({ id: createUser.insertId })
          const token = jwt.sign({ id: user[0].id, role: user[0].role }, APP_KEY)
          mailer(device, 'register', token, email, 'Tickitz Verification Email', 'Thanks for signing up for Tickitz! clik button in below.')
          return res.json({
            success: true,
            message: 'register success, check your email to activate account'
          })
        }
        return status.unauthorized(res, 'Cant create profile.')
      } else {
        return status.unauthorized(res, 'Register Failed.')
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  verivedEmail: async (req, res) => {
    try {
      const { device, token } = req.query
      const data = jwt.verify(token, APP_KEY)
      const dateVerived = new Date().toISOString().slice(0, 19).replace('T', ' ')
      console.log(dateVerived)

      console.log(device)
      const verivedEmail = await userModel.updateUser(data.id, { email_verified_at: dateVerived })
      if (verivedEmail.affectedRows > 0) {
        if (device === 'mobile-app') {
          return res.redirect('tickitz://activate/success')
        } else {
          return res.redirect(301, `${CLIENT_URL}/sign-in?success=true`)
        }
      }
      if (device === 'mobile-app') {
        return res.redirect('tickitz://activate/failed')
      } else {
        return res.redirect(301, `${CLIENT_URL}/sign-up?success=failed`)
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  forgetPassword: async (req, res) => {
    try {
      const { device } = req.query
      const { email } = req.body

      const user = await userModel.getUserByCondition({ email })
      if (user.length > 0) {
        const token = jwt.sign({ id: user[0].id, role: user[0].role }, APP_KEY)
        mailer(device, 'forget-password', token, email, 'Tickitz Forget Password', 'There was recently a request to change the password on your accoun, clik button in below.')
        return res.json({
          success: true,
          message: 'Check your email to reset password.'
        })
      }
      return status.notFound(res, 'Email not found.')
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  },
  verivedChangePassword: async (req, res) => {
    try {
      const { device, token } = req.query
      if (device === 'mobile-app') {
        return res.redirect(`tickitz://forgetPassword/${token}`)
      } else {
        return res.redirect(301, `${CLIENT_URL}/reset-password?token=${token}`)
      }
    } catch (err) {
      console.log(err)
      return status.serverError(res)
    }
  }
}
