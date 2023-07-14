const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const ytdl = require('ytdl-core');
const { Server } = require("socket.io");
const { default: axios } = require('axios');
const cors = require("cors");
const corsOptions = {
  origin: '*',
  credentials: true,            //access-control-allow-credentials:true
  optionSuccessStatus: 200,
}
const { getSong } = require('./functions/socketFunctions')

app.use(cors(corsOptions))
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.json({ limit: "50mb" }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get('/music', (req, res) => {
  res.send("Ok")
})

app.get("/music/:song", async function (req, res) {
  const songName = req.params.song
  var { url, title, thumbnail } = await getSong(songName);
  res.json({ url, title, thumbnail, songName })
});

app.post("/music/songv2", async function (req, res) {
  
})

io.on('connection', (socket) => {

  console.log('a user connected');

  socket.on('playsongOld', song => {
    axios
      .get(`https://vid.puffyan.us/search?q=${song}+audio+song`)
      .then(async (res1) => {
        var startIndex = res1.data.indexOf("href=\"/watch?v=") + 15
        var id = res1.data.slice(startIndex, startIndex + 11)
        // console.log("Getting url for id: ", id)
        let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
        // console.log(e.videoDetails.thumbnails)
        let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
        var url = audioFormat.url;
        var title = e.videoDetails.title
        var thumbnails = e.videoDetails.thumbnails
        var thumbnail = e.videoDetails.thumbnails[thumbnails.length - 1]
        io.emit('playsong', {
          url,
          title,
          thumbnail
        })
      })
  })

  socket.on('playsong', async (song) => {
    var { url, title, thumbnail } = await getSong(song);
    io.emit('playsong', { url, title, thumbnail })
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});