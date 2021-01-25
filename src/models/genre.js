const db = require('../helpers/db')

module.exports = {
  createGenre: async (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`
        INSERT INTO genre
        (${Object.keys(data).join()})
        VALUES
        (${Object.values(data).map(item => `"${item}"`).join(',')})
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  checkGenre: async (name) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT name FROM genre where name LIKE "%${name}%"
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  genreByid: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT * FROM genre ${id ? `WHERE id=${id}` : ''}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateGenre: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)
      db.query(`
        UPDATE genre
        SET ${key.map((item, index) => `${item}="${value[index]}"`)}
        WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteGenre: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
        DELETE FROM genre WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  checkAllGenres: (data = []) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT * FROM genre WHERE id IN (${data.map(item => item).join()})`, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
