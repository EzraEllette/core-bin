const express = require('express');
const redis = require('redis');
const app = express();

app.use(express.json());

app.get('/', (req, res) => {

});
app.get('/request', (req, res) => {
    res.json(req);
});

app.post('/request', (req, res) => {
    res.json(req);
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`The server is listening on port: ${PORT}`);
});