const db = require('../helpers/db')

module.exports = {
  createCinemas: async (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO cinemas
        (${Object.keys(data).join()})
        VALUES
        (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getCinemasById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM cinemas
        WHERE id=${id}
     `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateCinema: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)
      db.query(`
        UPDATE cinemas
        SET ${key.map((item, index) => `${item}="${value[index]}"`)}
        WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteCinema: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        DELETE FROM cinemas WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
