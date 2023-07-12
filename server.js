const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { default: axios } = require('axios');
const io = new Server(server,
  {
    cors: {
      origin: "*"
    }
  }
);

app.use(express.json({ limit: "50mb" }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/music',(req,res) => {
  res.setHeader('Content-Type', 'audio/mpeg')
  const audioStream = fs.createReadStream('music/song.mp3');
  audioStream.pipe(res)
})

app.get("/music/:song", function (req, res) {
  // Ensure there is a range given for the video
  const range = req.headers.range;
  if (!range) {
    res.status(400).send("Requires Range header");
  }

  // get video stats (about 61MB)
  const videoPath = `music/${req.params.song}.mp3`;
  const videoSize = fs.statSync(videoPath).size;

  // Parse Range
  // Example: "bytes=32324-"
  const CHUNK_SIZE = 10 ** 6; // 1MB
  const start = Number(range.replace(/\D/g, ""));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  // Create headers
  const contentLength = end - start + 1;
  const headers = {
    "Content-Range": `bytes ${start}-${end}/${videoSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": contentLength,
    "Content-Type": "audio/mp3",
  };

  // HTTP Status 206 for Partial Content
  res.writeHead(206, headers);

  // create video read stream for this particular chunk
  const audioStream = fs.createReadStream(videoPath, { start, end });

  // Stream the video chunk to the client
  audioStream.pipe(res);
});

app.get("/music1/:song",(req,res) => {
  axios
    .get(`https://vid.puffyan.us/search?q=${req.params.song}`)
    .then((res1) => {
      console.log((res1.data))
      res.send("Ok")
    })
})

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('playsong',song => {
    io.emit('playsong',song)
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});