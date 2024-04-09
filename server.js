const { Pool } = require("pg");
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const pool = new Pool(
  {
    user: "postgres",
    password: "password123",
    host: "localhost",
    database: "employee_db",
  },
  console.log("Connected to employee_db")
);

pool.connect();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = pool;