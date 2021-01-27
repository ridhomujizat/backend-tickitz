const db = require('../helpers/db')

module.exports = {
  createShowTime: async (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO show_time
        (${Object.keys(data).join()})
        VALUES
        (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getTime: async () => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT * FROM show_time
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getShowTimeById: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM show_time
        WHERE id=${id}
     `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateShowTime: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)
      db.query(`
        UPDATE show_time
        SET ${key.map((item, index) => `${item}="${value[index]}"`)}
        WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteShowTime: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        DELETE FROM show_time  WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  checkAllShowTime: (data = []) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as totalData FROM show_time WHERE id IN (${data.map(item => item).join()})`, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

}
