const { check } = require('express-validator')

module.exports = {
  validationCreateGenre: [
    check('name')
      .notEmpty().withMessage('name genre is required!')
      .isLength({ min: 3, max: 100 }).withMessage('name length must min 3 & max 100!')
  ],
  validationCreatMovie: [
    check('title')
      .notEmpty().withMessage('name is required!')
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
      .isLength({ min: 10, max: 1000 }).withMessage('descriptio length must min 10 & max 1000!'),
    check('status')
      .notEmpty().withMessage('status is required!')
      .isIn(['upcoming', 'released']).withMessage('velue status just upcoming & released')
  ],
  validationUpdateMovie: [
    check('title').optional()
      .isLength({ min: 3, max: 100 }).withMessage('name length must min 3 & max 100!'),
    check('directed').optional()
      .isLength({ min: 3, max: 100 }).withMessage('directed length must min 3 & max 100!'),
    check('hour').optional()
      .isLength({ max: 5 }).withMessage('hour length must max 5!'),
    check('minute').optional()
      .isLength({ max: 5 }).withMessage('minute length must max 5!'),
    check('casts').optional()
      .isLength({ min: 3, max: 1000 }).withMessage('casts length must min 3 & max 1000!'),
    check('description').optional()
      .isLength({ min: 10, max: 1000 }).withMessage('descriptio length must min 10 & max 1000!'),
    check('status').optional()
      .isIn(['upcoming', 'released']).withMessage('velue status just upcoming & released')
  ]
}
