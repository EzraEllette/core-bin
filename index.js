const express = require("express");
const redis = require("redis");
const { uid } = require("rand-token");

const redisClient = redis.createClient({
  host: process.env.HOST,
  password: process.env.PASSWORD,
});

const app = express();

app.get("/", (_req, res) => {
  res.json("home");
})

app.get("/getBin", (_req, res) => {
  const token = uid(10);
  redisClient.set(token, "{\"requests\": []}");
  redisClient.set(token, 1200);

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
    const { path, method, httpVersion, headers, body, ip } = req;
    const requestObject = { path, method, httpVersion, headers, body, ip };

    bin.requests.push(requestObject);

    redisClient.set(token, JSON.stringify(bin));

    res.send(req.ip);
  });
});

app.get("/bin/:token", (req, res) => {
  const token = req.params.token;

  redisClient.get(token, (_err, value) => {

    if (!value) {
      res.redirect("/");
    }

    res.send(JSON.parse(value));
  });
});

app.listen(process.env.PORT || 3000);
