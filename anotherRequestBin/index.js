const express = require("express");
const path = require("path");
const { uid } = require("rand-token");

const app = express();

const bins = {};

// 1. Route for generating bins
// 2. Route for accessing a bin
// 3. Route for sending requests to a bin

// app.use('/', express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
  res.json(bins);
})

app.get("/getBin", (req, res) => {
  const token = uid(10);
  bins[token] = [];
  const binURL = `localhost:3000/r/${token}`;

  res.send(binURL);
})

app.all("/r/:token", (req, res) => {
  const token = req.params.token;

  if (!bins[token]) {
    res.redirect("/");
    return
  }

  const { path, method, httpVersion, headers, body } = req;
  const requestObject = { path, method, httpVersion, headers, body };

  bins[token].push(requestObject);
  res.send(req.ip);
})

app.get("/bin/:token", (req, res) => {
  const token = req.params.token;

  if (!bins[token]) {
    res.redirect("/");
  }

  res.send(bins[token]);
})

app.listen(process.env.PORT || 3000);
