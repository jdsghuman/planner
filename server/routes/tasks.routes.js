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

router.put('/:id', (req, res) => {
    let id = req.params.id;
    console.log('Put route id: ', id);
    let taskCompleted = false;
    if(typeof req.body.completed == true) {
      taskCompleted = false;
    } else {
      taskCompleted = true;
    }
    console.log('Put route completed: ', taskCompleted);

    let queryText = (`UPDATE "todolist" SET "completed"=$1 WHERE id = $2`);

    pool.query(queryText, [taskCompleted, id])
      .then((results) => {
        console.log('put route ', results);
        res.sendStatus(200);
      }).catch((err) => {
        console.log(err);
        res.sendStatus(500);
      });
});

router.delete('/:id', (req, res) => {
  const id = req.params.id;
  console.log('id in server delete route: ', id);
  const queryText = `DELETE FROM "todolist" WHERE id = $1;`;
  pool.query(queryText, [id])
    .then((response) => {
      res.sendStatus(204);
    }).catch((err) => {
      console.log(err);
    });
});

router.get('/', (req, res) => {
  console.log('in GET route');
  const queryText = `SELECT * FROM "todolist";`;
  pool.query(queryText).then((results) => {
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
  const queryText = `INSERT INTO "todolist" ("task_title", "task_detail") VALUES($1, $2);`;
  pool.query(queryText, [req.body.taskTitle, req.body.taskDetail])
    .then(() => {
      res.sendStatus(201);
    }).catch((err) => {
      console.log('Error in POST', err);
      res.sendStatus(500);
    });
});

module.exports = router;