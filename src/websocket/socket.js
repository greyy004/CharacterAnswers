import { Server } from 'socket.io';
import { handleMessage } from '../controllers/messageController.js';

function initWebSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    socket.on('chat:message', async (message) => {
      if (typeof message !== 'string') return;

      const result = await handleMessage({
        message,
        sender: 'chat-bot'
      });

      socket.emit('chat:message', result);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });
}

export default initWebSocket;
