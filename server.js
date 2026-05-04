import express from 'express';
import http from 'http';
import roomRoutes from './src/routes/roomRoutes.js';
import initWebSocket from './src/websocket/socket.js';
import * as dotenv from 'dotenv';
dotenv.config();

const app = express();
const server = http.createServer(app);

// middleware
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
  res.sendFile('public/html/landingpage.html', { root: '.' });
});

app.use('/room', roomRoutes);
// socket.io
initWebSocket(server);


const port = process.env.WS_PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 
