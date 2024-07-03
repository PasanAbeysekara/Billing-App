const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

router.get('/commissions', (req, res) => {
  const sql = `SELECT dsrId, SUM(commission) as totalCommission FROM dsr_commissions GROUP BY dsrId`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
