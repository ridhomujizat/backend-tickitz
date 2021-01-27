const db = require('../helpers/db')

module.exports = {
  getSeatTypeById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM seat_type
        WHERE id=${id}
     `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
