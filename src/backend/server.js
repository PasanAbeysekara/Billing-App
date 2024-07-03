const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors'); // Import the cors package

const app = express();
const port = 3000;

app.use(cors()); // Enable CORS
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database(path.join(__dirname, 'database.sqlite'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    commissionRate REAL
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS bills (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    totalAmount INTEGER,
    advancePayment INTEGER,
    remainingPayment INTEGER
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS jobs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    billId INTEGER,
    department TEXT,
    dsrId INTEGER,
    amount INTEGER,
    FOREIGN KEY(billId) REFERENCES bills(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS dsr_commissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    dsrId INTEGER,
    billId INTEGER,
    department TEXT,
    commission REAL
  )`);
});

app.use(express.static(path.join(__dirname, '../frontend')));

// Routes
const billRoutes = require('./routes/bill');
app.use('/api/bills', billRoutes);

const dsrRoutes = require('./routes/dsr');
app.use('/api/dsrs', dsrRoutes);

const departmentRoutes = require('./routes/department');
app.use('/api/departments', departmentRoutes);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
