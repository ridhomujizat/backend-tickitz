const db = require('../helpers/db')

module.exports = {
  getLocation: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM location ${id ? `WHERE id="${id}"` : ''}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
