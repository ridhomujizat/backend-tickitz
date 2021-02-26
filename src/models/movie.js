const db = require('../helpers/db')

module.exports = {
  createMovie: async (data = {}) => {
    return new Promise((resolve, reject) => {
      db.query(`
      INSERT INTO movies
      (${Object.keys(data).join()})
      VALUES
      (${Object.values(data).map(item => `"${item}"`).join(',')})
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  createMovieGenre: async (id, data = []) => {
    return new Promise((resolve, reject) => {
      db.query(`
      INSERT INTO movie_genres
      (idMovie, idGenre)
      VALUES
      ${data.map(idGenre => `(${id}, ${idGenre})`).join()}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  readMovieDetail: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name ORDER BY g.name DESC SEPARATOR ', ') AS genre  
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.idMovie
      LEFT JOIN genre g ON mg.idGenre = g.id
      WHERE m.id=${id} 
      GROUP BY m.id, m.image, m.releaseDate, m.directed, m.hour, m.minute, m.casts, m.description, m.status, m.slug, m.createdAt, m.updatedAt
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  readMovieDetailSlug: async (slug) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name ORDER BY g.name DESC SEPARATOR ', ') AS genre  
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.idMovie
      LEFT JOIN genre g ON mg.idGenre = g.id
      WHERE m.slug='${slug}' 
      GROUP BY m.id, m.image, m.releaseDate, m.directed, m.hour, m.minute, m.casts, m.description, m.status, m.slug, m.createdAt, m.updatedAt
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  readMoviebyCond: async (cond) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT m.*, GROUP_CONCAT(DISTINCT g.name ORDER BY g.name DESC SEPARATOR ', ') AS genre
      FROM movies m
      LEFT JOIN movie_genres mg ON m.id = mg.idMovie
      LEFT JOIN genre g ON mg.idGenre = g.id
      WHERE m.title LIKE "%${cond.search}%" AND m.status LIKE "%${cond.status}%"
      GROUP BY m.id, m.image, m.releaseDate, m.directed, m.hour, m.minute, m.casts, m.description, m.status, m.slug, m.createdAt, m.updatedAt
      ORDER BY ${cond.sort} ${cond.order}
      LIMIT ${cond.dataLimit} OFFSET ${cond.offset}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  checkTotalMovieCond: async (cond) => {
    return new Promise((resolve, reject) => {
      db.query(`
        SELECT COUNT(*) as totalData FROM movies WHERE title LIKE "%${cond.search}%" AND status LIKE "%${cond.status}%"
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateMovie: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)

      db.query(`
      UPDATE movies
      SET ${key.map((item, index) => `${item}="${value[index]}"`)}
      WHERE id=${id}
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteMovie: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      DELETE FROM movies WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  deleteMovieGenre: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      DELETE FROM movie_genres WHERE idMovie=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
