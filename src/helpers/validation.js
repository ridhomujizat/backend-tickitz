const { check } = require('express-validator')

module.exports = {
  validationCreateGenre: [
    check('name')
      .notEmpty().withMessage('name genre is required!')
      .isLength({ min: 3, max: 100 }).withMessage('name length must min 3 & max 100!')
  ],
  validationCreatMovie: [
    check('title')
      .notEmpty().withMessage('title is required!')
      .isLength({ min: 3, max: 100 }).withMessage('title length must min 3 & max 100!'),
    check('releaseDate')
      .notEmpty().withMessage('date is required!'),
    check('directed')
      .notEmpty().withMessage('directed is required!')
      .isLength({ min: 3, max: 100 }).withMessage('directed length must min 3 & max 100!'),
    check('hour')
      .isLength({ max: 5 }).withMessage('hour length must max 5!'),
    check('minute')
      .isLength({ max: 5 }).withMessage('minute length must max 5!'),
    check('casts')
      .notEmpty().withMessage('casts is required!')
      .isLength({ min: 3, max: 1000 }).withMessage('casts length must min 3 & max 1000!'),
    check('description')
      .notEmpty().withMessage('description is required!')
      .isLength({ min: 10, max: 1000 }).withMessage('description length must min 10 & max 1000!'),
    check('status')
      .notEmpty().withMessage('status is required!')
      .isIn(['upcoming', 'released']).withMessage('velue status just upcoming & released')
  ],
  validationUpdateMovie: [
    check('title').optional()
      .isLength({ min: 3, max: 100 }).withMessage('title length must min 3 & max 100!'),
    check('directed').optional()
      .isLength({ min: 3, max: 100 }).withMessage('directed length must min 3 & max 100!'),
    check('hour').optional()
      .isLength({ max: 5 }).withMessage('hour length must max 5!'),
    check('minute').optional()
      .isLength({ max: 5 }).withMessage('minute length must max 5!'),
    check('casts').optional()
      .isLength({ min: 3, max: 1000 }).withMessage('casts length must min 3 & max 1000!'),
    check('description').optional()
      .isLength({ min: 10, max: 1000 }).withMessage('description length must min 10 & max 1000!'),
    check('status').optional()
      .isIn(['upcoming', 'released']).withMessage('velue status just upcoming & released')
  ],
  validationCreateCinema: [
    check('name')
      .notEmpty().withMessage('name is required!')
      .isLength({ min: 3, max: 100 }).withMessage('name length must min 2 & max 100!'),
    check('address')
      .notEmpty().withMessage('address is required!')
      .isLength({ min: 5, max: 10000 }).withMessage('address length must min 10 & max 1000!'),
    check('price')
      .notEmpty().withMessage('price is required!')
      .isLength({ min: 2, max: 1000 }).withMessage('address length must min 10 & max 1000!')

  ],
  validationUpdateCinema: [
    check('name')
      .optional()
      .isLength({ min: 3, max: 100 }).withMessage('name length must min 2 & max 100!'),
    check('address')
      .optional()
      .isLength({ min: 5, max: 10000 }).withMessage('address length must min 10 & max 1000!'),
    check('price')
      .optional()
      .isLength({ min: 2, max: 1000 }).withMessage('address length must min 10 & max 1000!')
  ],
  validateShowTime: [
    check('time')
      .notEmpty().withMessage('time is required!')
  ],
  validationCreateSchedule: [
    check('idMovie')
      .notEmpty().withMessage('Movie is required'),
    check('idCinema')
      .notEmpty().withMessage('Cinema is required'),
    check('idTime')
      .notEmpty().withMessage('Movie is required'),
    check('seatType')
      .notEmpty().withMessage('Movie is required'),
    check('date')
      .notEmpty().withMessage('Movie is required')
  ],
  validateProfile: [
    check('firstName')
      .notEmpty().withMessage('Frist Name is required')
      .isLength({ min: 1, max: 100 }).withMessage('Frist Name length must min 2 & max 100!'),
    check('lastName')
      .optional()
      .isLength({ max: 100 }).withMessage('Last Name length must max 100!'),
    check('phone')
      .optional()
      .isLength({ min: 9, max: 100 }).withMessage('Phone length must min 9 & max 100!')
  ],
  validateupdateProfile: [
    check('firstName')
      .optional()
      .isLength({ min: 1, max: 100 }).withMessage('Frist Name length must min 2 & max 100!'),
    check('lastName')
      .optional()
      .isLength({ max: 100 }).withMessage('Last Name length must max 100!'),
    check('phone')
      .optional()
      .isLength({ min: 9, max: 100 }).withMessage('Phone length must min 9 & max 100!')
  ]
}
