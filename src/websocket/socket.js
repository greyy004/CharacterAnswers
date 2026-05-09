import { Server } from 'socket.io';
import { joinRoom, findRoomByCode } from '../models/roomModel.js';
import { handleMessageForAI, handleMessage } from '../controllers/messageController.js';
import { createChatMessage } from '../utils/chatMessage.js';
import cookie from 'cookie';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
dotenv.config();

function initWebSocket(server) {
  const io = new Server(server);
  //  AUTH MIDDLEWARE
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.request.headers.cookie || '');
      const token = cookies.token;
      if (!token) {
        return next(new Error('No token provided'));
      }
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      socket.user = decoded;
      socket.data.uid = decoded.uid;
      console.log("Socket user:", socket.user);
      console.log(
        `WebSocket auth successful for user: ${socket.user.username} (${socket.user.uid})`
      );
      next();
    } catch (err) {
      console.error('WebSocket auth error:', err.message);
      next(new Error('Invalid token'));
    }
  });
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.user.username}`);
    socket.emit(
      'chat:message',
      createChatMessage({
        sender: 'system',
        type: 'system',
        message: 'Connected to session'
      })
    );
    // JOIN ROOM
    socket.on('room:join', async ({ roomCode } = {}) => {
      const normalizedRoomCode = String(roomCode || '').toUpperCase();
      if (!normalizedRoomCode) {
        socket.emit('room:error', { message: 'Room code is required.' });
        return;
      }
      if (socket.data.roomCode) {// Leaves the current room
        socket.leave(socket.data.roomCode);
      }
      socket.join(normalizedRoomCode);
      socket.data.roomCode = normalizedRoomCode;
      try{
        const joinResult = await joinRoom(normalizedRoomCode, socket.data.uid);
      }
      catch(err){
        console.error('Failed to join room:', err);
        socket.emit('room:error', { message: 'Failed to join room. Please try again.' });
        return;
      }
      socket.emit('room:joined', { roomCode: normalizedRoomCode });
    });

    // CHAT MESSAGE
    socket.on('chat:message', async (message) => {
      if (typeof message !== 'string') return;
      const trimmedMessage = message.trim();
      if (!trimmedMessage) return;
      const senderName = socket.user.username
      const senderUid = socket.user.uid;
      const target = socket.data.roomCode
        ? socket.to(socket.data.roomCode)
        : socket.broadcast;
      target.emit(
        'chat:message',
        createChatMessage({
          sender: senderName,
          message: trimmedMessage
        })
      );
      try {
        console.log(`Handling message from ${senderName} (${senderUid}): ${trimmedMessage} from room: ${socket.data.roomCode} `);
        const getRoomId = await findRoomByCode(socket.data.roomCode);
        const msgReply = await handleMessage(senderUid, trimmedMessage, getRoomId.id);
        if (msgReply) {
          console.log("msg saved");
        }
      }
      catch (err) {
        console.error('Failed to handle message:', err);
      }
      const aiReply = await handleMessageForAI({
        message: trimmedMessage,
        sender: 'chat-bot'
      });
      if (socket.data.roomCode) {
        io.to(socket.data.roomCode).emit('chat:message', aiReply);
      } else {
        io.emit('chat:message', aiReply);
      }
    });

    // DISCONNECT
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.user.userId}`);
    });
  });
}

export default initWebSocket;