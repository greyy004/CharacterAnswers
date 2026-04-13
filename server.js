import express from 'express';
import http from 'http';

import initWebSocket from './src/websocket/socket.js';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
  res.sendFile('public/html/terminal.html', { root: '.' });
});


// websocket
initWebSocket(server);

const port = process.env.WS_PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
  console.log(`WebSocket running on ws://localhost:${port}`);
});