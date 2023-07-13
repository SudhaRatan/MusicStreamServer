const express = require('express');
const app = express();
const http = require('http');
const fs = require('fs');
const server = http.createServer(app);
const ytdl = require('ytdl-core');
const { Server } = require("socket.io");
const { default: axios } = require('axios');
const cors=require("cors");
const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))
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

app.get('/music', (req, res) => {
  res.send("Ok")
})


app.get("/music/:song", function (req, res) {

  axios
    .get(`https://vid.puffyan.us/search?q=${req.params.song}+song`)
    .then(async (res1) => {
      var startIndex = res1.data.indexOf("href=\"/watch?v=") + 15
      var id = res1.data.slice(startIndex, startIndex + 11)
      // console.log("Getting url for id: ", id)
      let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
      let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
      var url = audioFormat.url;
      res.json({
        url: url
      })
    })
});

io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('playsong', song => {
    axios
    .get(`https://vid.puffyan.us/search?q=${song}+song`)
    .then(async (res1) => {
      var startIndex = res1.data.indexOf("href=\"/watch?v=") + 15
      var id = res1.data.slice(startIndex, startIndex + 11)
      // console.log("Getting url for id: ", id)
      let e = await ytdl.getInfo(`http://www.youtube.com/watch?v=${id}`);
      let audioFormat = ytdl.chooseFormat(e.formats, { quality: 'highestaudio', filter: 'audioonly' });
      var url = audioFormat.url;
      io.emit('playsong', url)
    })
    
  })

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

server.listen(3000, () => {
  console.log('listening on *:3000');
});