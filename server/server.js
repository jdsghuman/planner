const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;
const tasks = require('./routes/tasks.routes');

// Uses
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static('server/public'));

app.use('/tasks', tasks);

// Spin up server
app.listen(PORT, () => {
  console.log('listen on PORT ', PORT);
});
