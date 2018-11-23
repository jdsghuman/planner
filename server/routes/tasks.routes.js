const express = require('express');
const router = express.Router();

// DB Connection
const pg = require('pg');
const Pool = pg.Pool;

const config = {
  database: 'weekend-to-do-app', // name of database
  host: 'localhost',
  port: 5432,
  max: 10, 
  idleTimeoutMillis: 10000 // connection timeout
} 

const pool = new Pool(config);

pool.on('connect', () => {
  console.log('postgresql connected');
});

pool.on('error', (error) => {
  console.log('Error connecting to DB', error);
});

router.get('/', (req, res) => {
  console.log('in GET route');
  const query = `SELECT * FROM "todolist";`;
  pool.query(query).then((results) => {
    console.log(results.rows);
    res.send(results.rows);
  }).catch((error) => {
    console.log('Error from GET', error);
    res.sendStatus(500);
  });
});

module.exports = router;