const multer = require('multer')
const path = require('path')

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/movies')
  },
  filename: (req, file, cb) => {
    cb(null, `movie-${file.fieldname}-${new Date().getTime()}.${file.originalname.split('.')[file.originalname.split('.').length - 1]}`)
  }
})

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname)

  if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
    return cb(new Error('Only images are allowed'), 'tai')
  }
  cb(null, true)
}

const limits = {
  fileSize: 1 * 1024 * 1024
}

const uploadMovies = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: limits
}).single('image')

const upload = (req, res, next) => {
  uploadMovies(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      console.log(multer.MulterError)
      return res.json({
        success: false,
        message: err.message
      })
    } else if (err) {
      return res.json({
        success: false,
        message: 'Failed to upload image!'
      })
    }
    next()
  })
}

module.exports = upload
