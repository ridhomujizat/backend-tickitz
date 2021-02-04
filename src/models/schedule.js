const db = require('../helpers/db')

module.exports = {
  createSchedule: async (data) => {
    return new Promise((resolve, reject) => {
      const { idMovie, idCinema, idTime, seatType, date, createdBy } = data
      console.log(idTime.map(item => `rte ${item}`))
      db.query(`
      INSERT INTO schedule
      (idMovie, idCinema, idTime, seatType, date, createdBy)
      VALUES
      ${idTime.map(item => `(${idMovie}, ${idCinema}, ${item},${seatType},'${date}',${createdBy})`).join()}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getScheduleByMovie: async (slug, cond) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT idMovie, m.title, idCinema, c.name, c.image, c.address, c.price, c.location, l.name as location, date, 
      d.id, t.time, s.seat
      FROM schedule d
      INNER JOIN movies m ON m.id = d.idMovie
      INNER JOIN cinemas c ON c.id = d.idCinema
      INNER JOIN show_time t ON t.id = d.idTime
      INNER JOIN location l ON l.id = c.location
      INNER JOIN seat_type s ON s.id = d.seatType
      WHERE slug ='${slug}'
      ${cond.idLocation ? `AND c.location = ${cond.idLocation}` : ''}
      ${cond.date ? `AND d.date = '${cond.date}'` : ''}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
