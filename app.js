// app.js

const express = require('express');
const dotenv = require('dotenv');


dotenv.config({
    paath: './config.env'
})

const app = express();
const port = process.env.PORT || 3000;


app.get('/', (req, res) => {
    res.send('Working!');
  });
app.get('/biraj', (req, res) => {
  res.send('Happy Birthday!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
