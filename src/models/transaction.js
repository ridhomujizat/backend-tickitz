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
  createTransaction: async (id) => {
    return new Promise((resolve, reject) => {
      db.query(`
      INSERT INTO transaction (createdBy) VALUES (${id});
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
  }
}
