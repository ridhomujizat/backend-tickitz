const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
const status = require('./src/helpers/errorRespon')

dotenv.config()
const { APP_PORT } = process.env

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors('*'))

// Routers
app.use('/genre', require('./src/routers/genre'))
app.use('/movies', require('./src/routers/movie'))
app.use('/cinema', require('./src/routers/cinema'))
app.use('/showtime', require('./src/routers/showTIme'))
app.use('/schedule', require('./src/routers/schedule'))
app.use('', require('./src/routers/auth'))

// Test App
app.get('/', (req, res) => {
  const data = {
    success: true,
    message: 'Backend is running wel'
  }
  res.send(data)
})

// Not Found Api
app.get('*', (req, res) => {
  status.notFound(res, 'API Not Found!')
})

app.listen(APP_PORT, () => {
  console.log(`App is running on port ${APP_PORT}`)
})
