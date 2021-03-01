const db = require('../helpers/db')

module.exports = {
  checkSeatInSchedule: async (id, data = []) => {
    return new Promise((resolve, reject) => {
      db.query(`SELECT COUNT(*) as totalData FROM cart 
      INNER JOIN transaction t ON idTransaction = t.id 
      WHERE idSchedule=${id}  
      AND t.status ='success'
      AND seatSelected  IN (${data.map(item => `'${item}'`).join()})
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  createTransaction: async (data) => {
    return new Promise((resolve, reject) => {
      db.query(`
      INSERT INTO transaction
      (${Object.keys(data).join()})
      VALUES
      (${Object.values(data).map(item => `"${item}"`).join(',')})
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  addItemCart: async (idSchedule, idTransaction, seat = []) => {
    return new Promise((resolve, reject) => {
      db.query(`
      INSERT INTO cart
      (idTransaction,idSchedule,  seatSelected)
      VALUES
      ${seat.map(seatselect => `( '${idTransaction}', '${idSchedule}','${seatselect}')`).join()}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  readsSeatSold: async (idSchedule) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT seatSelected
      FROM cart
      INNER JOIN transaction t ON idTransaction = t.id 
      AND t.status ='success'
      WHERE idSchedule=${idSchedule}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getdetailTransaction: async (idTransaction) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT t.*,s.date,st.time,ci.price, GROUP_CONCAT(DISTINCT c.seatSelected ORDER BY c.seatSelected DESC SEPARATOR ', ') AS seatSelected
      FROM transaction t
      INNER JOIN cart c ON c.idTransaction = t.id
      INNER JOIN schedule s ON s.id = c.idSchedule
      INNER JOIN show_time st ON st.id = s.idTime
      INNER JOIN cinemas ci ON ci.id = s.idCinema
      WHERE t.id=${idTransaction}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  getHistoryTransaction: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      SELECT t.*,s.date,st.time,ci.price, c.seatSelected, ci.image
      FROM transaction t
      INNER JOIN cart c ON c.idTransaction = t.id
      INNER JOIN schedule s ON s.id = c.idSchedule
      INNER JOIN show_time st ON st.id = s.idTime
      INNER JOIN cinemas ci ON ci.id = s.idCinema
      WHERE t.createdBy=${id}
      ORDER BY t.createdAt DESC
      LIMIT 5

      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  },
  updateTransaction: async (id, data) => {
    return new Promise((resolve, reject) => {
      const key = Object.keys(data)
      const value = Object.values(data)
      db.query(`
        UPDATE transaction
        SET ${key.map((item, index) => `${item}="${value[index]}"`)}
        WHERE id=${id}
      `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }
}
