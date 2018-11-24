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
    console.log('in GET route', results.rows);
    res.send(results.rows);
  }).catch((error) => {
    console.log('Error from GET', error);
    res.sendStatus(500);
  });
});

router.post('/', (req, res) => {
  console.log('in POST route');
  const newTask = req.body;
  console.log('new Task in route: ', newTask);
  const query = `INSERT INTO "todolist" ("task_title", "task_detail") VALUES($1, $2);`;
  pool.query(query, [req.body.taskTitle, req.body.taskDetail])
    .then(() => {
      res.sendStatus(201);
    }).catch((err) => {
      console.log('Error in POST', err);
      res.sendStatus(500);
    });
});

module.exports = router;