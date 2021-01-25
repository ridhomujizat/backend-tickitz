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
        SELECT id, name FROM genre WHERE name = "${name}"
      `, (err, res, field) => {
        if (err) reject(err)
        console.log(err)
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
  getMovieGenre: async (id, cond) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT m.*, GROUP_CONCAT(DISTINCT g.name ORDER BY g.name DESC SEPARATOR ', ') AS genre  
      FROM movies m
      INNER JOIN movie_genres mg ON m.id = mg.idMovie
      INNER JOIN genre g ON mg.idGenre = ${id}
      WHERE m.title LIKE "%${cond.search}%"
      GROUP BY m.id, m.image, m.releaseDate, m.directed, m.hour, m.minute, m.casts, m.description, m.status, m.slug, m.createdAt, m.updatedAt
      ORDER BY ${cond.sort} ${cond.order}
      LIMIT ${cond.dataLimit} OFFSET ${cond.offset}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  countMovieGenre: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT count(*) as totalData FROM movie_genres WHERE idGenre = ${id}
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
