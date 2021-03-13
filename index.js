const path = require('path');
const express = require("express");
const redis = require("redis");
require('dotenv').config();
const { uid } = require("rand-token");
const redisClient = redis.createClient({
  host: process.env.HOST,
  password: process.env.PASSWORD,
});
const root = __dirname + "/public/"
const app = express();

app.use('/', express.static(path.join(__dirname, 'public')));
app.get("/", (_req, res) => {
  res.sendFile("index.html", {root});
});

app.get("/getBin", (_req, res) => {
  const token = uid(10);
  redisClient.set(token, "{\"requests\": []}");

  const binURL = `localhost:3000/r/${token}`;
  res.send(binURL);
})

app.all("/r/:token", (req, res) => {
  const token = req.params.token;

  redisClient.get(token, (_err, value) => {

    if (!value) {
      res.redirect("/");
      return
    }
    const bin = JSON.parse(value);
    console.log(bin);
    const { path, method, httpVersion, headers, body } = req;
    const requestObject = { path, method, httpVersion, headers, body };

    bin.requests.push(requestObject);

    redisClient.set(token, JSON.stringify(bin));

    res.send(req.ip);
  });
});

app.get('/find/:token', async (req, res) => {
  const token = req.params.token;
  await redisClient.get(token, (_err, value) => {
    if (!value) {
      res.redirect("/");
   }
    res.send(JSON.parse(value))
  });
})
app.get("/bin/:token", (req, res) => {
  res.sendFile("requests.html", {root});

});
const PORT =  process.env.PORT || 3000 // change for production
app.listen(PORT);
