import { Server } from 'socket.io';
import { handleMessage } from '../controllers/messageController.js';
import { hasRoom } from '../stores/roomStore.js';
import { createChatMessage } from '../utils/chatMessage.js';

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
      socket.emit(
        'chat:message',
        createChatMessage({
          sender: 'system',
          type: 'system',
          message: `Joined room ${normalizedRoomCode}`
        })
      );
    });

    socket.on('chat:message', async (message) => {
      if (typeof message !== 'string') return;

      if (!socket.data.roomCode) {
        socket.emit('room:error', { message: 'Join a room before sending messages.' });
        return;
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;

      socket.to(socket.data.roomCode).emit(
        'chat:message',
        createChatMessage({
          sender: socket.id,
          message: trimmedMessage
        })
      );

      const aiReply = await handleMessage({
        message: trimmedMessage,
        sender: 'chat-bot'
      });

      io.to(socket.data.roomCode).emit('chat:message', aiReply);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });
}

export default initWebSocket;
