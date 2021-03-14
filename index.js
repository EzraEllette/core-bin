const express = require("express");
const redis = require("redis");
const { uid } = require("rand-token");




const app = express();
app.use(express.static("public"));


const redisClient = redis.createClient({
  host: process.env.HOST,
  password: process.env.PASSWORD,
});
app.use(require("cors")());
const http = require('http').Server(app);
const io = require('socket.io')(http);
app.use(express.json());

app.get("/getBin", (_req, res) => {
  const token = uid(10);
  redisClient.set(token, "{\"requests\": []}");
  redisClient.expire(token, 1200);

  res.json({bin: token });
})

app.all("/r/:token", (req, res) => {
  const token = req.params.token;
  redisClient.get(token, (_err, value) => {

    if (!value) {
      res.redirect("/");
      return
    }

    const bin = JSON.parse(value);
    const { path, method, protocol, httpVersion, headers, body, ip } = req;
    const requestObject = { path, method, protocol, httpVersion, headers, body, ip };

    bin.requests.push(requestObject);
    redisClient.set(token, JSON.stringify(bin));
    io.to(token).emit("newRequest", requestObject);
    res.send(req.ip);
  });
});

app.get("/bin/:token", (req, res) => {
  const token = req.params.token;

  redisClient.get(token, (_err, value) => {

    if (!value) {
      res.redirect("/");
    }

    res.json(JSON.parse(value));
  });
});

// app.listen(process.env.PORT || 3000);

//Whenever someone connects this gets executed
io.on('connection', function(socket) {
  console.log('A user connected');

  socket.on('joinRoom', function (token) {
    socket.join(token)
  });


   //Whenever someone disconnects this piece of code executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

http.listen(process.env.PORT || 3000, function() {
   console.log('listening on *:3000');
});