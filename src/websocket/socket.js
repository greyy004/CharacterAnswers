import { Server } from 'socket.io';
import { handleMessage } from '../controllers/messageController.js';
import { createChatMessage } from '../utils/chatMessage.js';

function initWebSocket(server) {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log(`Socket.IO client connected: ${socket.id}`);

    socket.emit(
      'chat:message',
      createChatMessage({
        sender: 'system',
        type: 'system',
        message: 'Connected to session'
      })
    );

    socket.on('room:join', ({ roomCode } = {}) => {
      const normalizedRoomCode = String(roomCode || '').toUpperCase();

      if (!normalizedRoomCode) {
        socket.emit('room:error', { message: 'Room code is required.' });
        return;
      }

      if (socket.data.roomCode) {
        socket.leave(socket.data.roomCode);
      }

      socket.join(normalizedRoomCode);
      socket.data.roomCode = normalizedRoomCode;
      socket.emit('room:joined', { roomCode: normalizedRoomCode });
    });

    socket.on('chat:message', async (message) => {
      if (typeof message !== 'string') {
        return;
      }

      const trimmedMessage = message.trim();
      if (!trimmedMessage) {
        return;
      }

      const target = socket.data.roomCode ? socket.to(socket.data.roomCode) : socket.broadcast;

      target.emit(
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

      if (socket.data.roomCode) {
        io.to(socket.data.roomCode).emit('chat:message', aiReply);
        return;
      }

      io.emit('chat:message', aiReply);
    });

    socket.on('disconnect', () => {
      console.log(`Socket.IO client disconnected: ${socket.id}`);
    });
  });
}

export default initWebSocket;
