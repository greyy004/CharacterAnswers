import express from 'express';
import http from 'http';
import authRoutes from './src/routes/authRoutes.js';
import roomRoutes from './src/routes/roomRoutes.js';
import initWebSocket from './src/websocket/socket.js';
import * as dotenv from 'dotenv';
import { initdb } from './src/libs/initdb.js';
dotenv.config();
  
const app = express();
const server = http.createServer(app);

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Initialize database
try{
  await initdb();
  console.log("Database initialized successfully.");
}catch(err)
{
  console.error("Error initializing database:", err);
}


// routes
app.get('/', (req, res) => {
  res.sendFile('public/html/landingpage.html', { root: '.' });
});

app.get('/login', (req, res) => {
  res.sendFile('public/html/login.html', { root: '.' });
});

app.get('/register', (req, res) => {
  res.sendFile('public/html/register.html', { root: '.' });
});

app.get('/userDashboard', (req, res) => {
  res.sendFile('public/html/userDashboard.html', { root: '.' });
});

app.use('/auth', authRoutes);
app.use('/room', roomRoutes);
// socket.io
initWebSocket(server);


const port = process.env.WS_PORT || 5000;
server.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
}); 
