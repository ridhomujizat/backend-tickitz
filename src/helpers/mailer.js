const nodemailer = require('nodemailer')
const smtpTransport = require('nodemailer-smtp-transport')
const fs = require('fs')
const path = require('path')
const mustache = require('mustache')

const {
  EMAIL_SERVICE,
  EMAIL_HOST,
  EMAIL_USER,
  EMAIL_PASS
} = process.env

module.exports = (device, method, token, email, subject, message) => {
  const template = fs.readFileSync(path.resolve(__dirname, './mailTemplate.html'), 'utf-8')

  const transporter = nodemailer.createTransport(
    smtpTransport({
      service: EMAIL_SERVICE,
      host: EMAIL_HOST,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
      }
    })
  )

  const url = `${process.env.APP_URL}/redirect/${method}?device=${device}&token=${token}`
  const urlBrowser = `${process.env.APP_URL}/redirect/${method}?device=web-app&token=${token}`

  const mailOption = {
    from: EMAIL_USER,
    to: email,
    subject,
    html: mustache.render(template, { url, urlBrowser, subject, message })
  }

  transporter.sendMail(mailOption, (err, info) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Email sent', info)
    }
  })
}
