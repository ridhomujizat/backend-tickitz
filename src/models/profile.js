const db = require('../helpers/db')

module.exports = {
  creatProfile: async (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO profile
        (${Object.keys(data).join()})
        VALUES
        (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getDetailProfile: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT p.*, u.email FROM profile p
        INNER JOIN users u ON u.id = createdBy
        WHERE createdBy = ${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateUser: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)
      db.query(`
      UPDATE profile 
      INNER JOIN users u ON u.id = createdBy
      SET ${key.map((item, index) => `${item}="${value[index]}"`)}
      WHERE createdBy=${id}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteImage: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      UPDATE profile
      SET image = NULL
      WHERE createdBy=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
