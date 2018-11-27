const pg = require('pg');

// DB Connection
const Pool = pg.Pool;

const pool = new Pool({
  database: 'weekend-to-do-app', // name of database
  host: 'localhost',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 10000 // connection timeout
});

pool.on('connect', () => {
  console.log('postgresql connected');
});

pool.on('error', (error) => {
  console.log('Error connecting to DB', error);
});

module.exports = pool;
