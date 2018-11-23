const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000;

// Uses
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

// Spin up server
app.listen(PORT, () => {
  console.log('listen on PORT ', PORT);
});