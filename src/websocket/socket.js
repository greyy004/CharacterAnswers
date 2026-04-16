import { Server } from 'socket.io';
import { handleMessage } from '../controllers/messageController.js';
import { hasRoom } from '../stores/roomStore.js';

function initWebSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    socket.on('room:join', ({ roomCode } = {}) => {
      const normalizedRoomCode = String(roomCode || '').toUpperCase();

      if (!hasRoom(normalizedRoomCode)) {
        socket.emit('room:error', { message: 'Room not found.' });
        return;
      }

      socket.join(normalizedRoomCode);
      socket.data.roomCode = normalizedRoomCode;
      socket.emit('room:joined', { roomCode: normalizedRoomCode });
    });

    socket.on('chat:message', async (message) => {
      if (typeof message !== 'string') return;
      if (!socket.data.roomCode) {
        socket.emit('room:error', { message: 'Join a room before sending messages.' });
        return;
      }

      const result = await handleMessage({
        message,
        sender: 'chat-bot'
      });

      io.to(socket.data.roomCode).emit('chat:message', result);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });
}

export default initWebSocket;
