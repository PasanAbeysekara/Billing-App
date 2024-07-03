const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

exports.createBill = (totalAmount, advancePayment, remainingPayment, callback) => {
  const sql = `INSERT INTO bills (totalAmount, advancePayment, remainingPayment) VALUES (?, ?, ?)`;
  db.run(sql, [totalAmount, advancePayment, remainingPayment], function(err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID });
  });
};

exports.createJob = (billId, department, dsrId, amount, callback) => {
  const sql = `INSERT INTO jobs (billId, department, dsrId, amount) VALUES (?, ?, ?, ?)`;
  db.run(sql, [billId, department, dsrId, amount], function(err) {
    if (err) return callback(err);

    // Calculate commission
    const commissionRateSql = `SELECT commissionRate FROM departments WHERE name = ?`;
    db.get(commissionRateSql, [department], (err, row) => {
      if (err) return callback(err);
      const commission = row.commissionRate * amount;

      const commissionSql = `INSERT INTO dsr_commissions (dsrId, billId, department, commission) VALUES (?, ?, ?, ?)`;
      db.run(commissionSql, [dsrId, billId, department, commission], function(err) {
        if (err) return callback(err);
        callback(null, { id: this.lastID });
      });
    });
  });
};

exports.getDepartments = (callback) => {
  const sql = `SELECT * FROM departments`;
  db.all(sql, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};
