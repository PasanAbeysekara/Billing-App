const express = require('express');
const router = express.Router();
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database(path.join(__dirname, '../database.sqlite'));

router.get('/', (req, res) => {
  const sql = `SELECT * FROM departments`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(200).json(rows);
  });
});

module.exports = router;
