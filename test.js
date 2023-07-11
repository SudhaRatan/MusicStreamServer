const express = require('express');
const fs = require('fs');
const WebSocket = require('ws');

const app = express();
const port = 3000;

// Create a new HTTP server using the Express app
const server = app.listen(port, () => {
  console.log(`Radio server is running on port ${port}`);
});

// Create a new WebSocket server using the HTTP server
const wss = new WebSocket.Server({ server });

// Set up an array to keep track of connected clients
const clients = [];

// Function to broadcast audio data to all connected clients
const broadcastAudioData = (audioData) => {
  clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(audioData);
    }
  });
};

// Route to handle the radio stream
app.get('/stream', (req, res) => {
  // Set appropriate headers for audio streaming
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Pipe the audio data from the file to the response stream and broadcast it
  const audioStream = fs.createReadStream('music/song.mp3');
  audioStream.pipe(res);
  audioStream.on('data', (data) => {
    broadcastAudioData(data);
  });

  // Add the client to the list of connected clients
  const client = res.socket;
  clients.push(client);

  // Remove the client from the list of connected clients when the connection closes
  client.on('close', () => {
    const index = clients.indexOf(client);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});

// Handle WebSocket connections
wss.on('connection', (ws) => {
  // Add the client to the list of connected clients
  clients.push(ws);

  // Remove the client from the list of connected clients when the connection closes
  ws.on('close', () => {
    const index = clients.indexOf(ws);
    if (index > -1) {
      clients.splice(index, 1);
    }
  });
});
