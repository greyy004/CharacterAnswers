import { Server } from "socket.io";
import { joinRoom, leaveRoom, findRoomByCode } from "../models/roomModel.js";

import {
  handleMessageForAI,
  handleMessage,
} from "../controllers/messageController.js";

import { createChatMessage } from "../utils/chatMessage.js";

import cookie from "cookie";
import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

dotenv.config();

function initWebSocket(server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true,
    },
  });

  // AUTH MIDDLEWARE
  io.use((socket, next) => {
    try {
      const cookies = cookie.parse(socket.request.headers.cookie || "");

      const token = cookies.token;

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(token, process.env.SECRET_KEY);

      // Store user safely
      socket.data.user = decoded;

      console.log(
        `WebSocket auth successful for user: ${decoded.username} (${decoded.uid})`,
      );

      next();
    } catch (err) {
      console.error("WebSocket auth error:", err.message);

      next(new Error("Invalid token"));
    }
  });

  // CONNECTION
  io.on("connection", (socket) => {
    const { username: senderName, uid: senderUid } = socket.data.user;

    console.log(`Socket connected: ${senderName}`);

    socket.emit(
      "chat:message",
      createChatMessage({
        sender: "system",
        type: "system",
        message: "Connected to session",
      }),
    );

    // JOIN ROOM
    socket.on("room:join", async ({ roomCode } = {}) => {
      const normalizedRoomCode = String(roomCode || "")
        .trim()
        .toUpperCase();

      if (!normalizedRoomCode) {
        return socket.emit("room:error", {
          message: "Room code is required.",
        });
      }

      try {
        // Leave current room if already in one
        if (socket.data.roomCode) {
          const previousRoomCode = socket.data.roomCode;

          const previousRoom = await findRoomByCode(previousRoomCode);

          if (previousRoom) {
            await leaveRoom(previousRoom.id, senderUid);

            console.log(`User ${senderName} left room ${previousRoomCode}`);
          }

          socket.leave(previousRoomCode);
        }

        // Database join FIRST
        await joinRoom(normalizedRoomCode, senderUid);

        // THEN socket room join
        socket.join(normalizedRoomCode);

        // Save room to socket
        socket.data.roomCode = normalizedRoomCode;

        console.log(`User ${senderName} joined room ${normalizedRoomCode}`);

        socket.emit("room:joined", {
          roomCode: normalizedRoomCode,
        });
      } catch (err) {
        console.error("Failed to join room:", err);

        socket.emit("room:error", {
          message: "Failed to join room.",
        });
      }
    });

    // CHAT MESSAGE
    socket.on("chat:message", async (message) => {
      try {
        if (typeof message !== "string") return;

        const trimmedMessage = message.trim();

        if (!trimmedMessage) return;

        if (!socket.data.roomCode) {
          return socket.emit("chat:error", {
            message: "You must join a room first.",
          });
        }

        const roomCode = socket.data.roomCode;

        // Send user message to OTHER users
        socket.to(roomCode).emit(
          "chat:message",
          createChatMessage({
            sender: senderName,
            message: trimmedMessage,
          }),
        );

        console.log(
          `Handling message from ${senderName} (${senderUid}): ${trimmedMessage}`,
        );

        // Find room
        const room = await findRoomByCode(roomCode);

        if (!room) {
          return socket.emit("chat:error", {
            message: "Room not found.",
          });
        }

        // Save message
        await handleMessage(senderUid, trimmedMessage, room.id);

        console.log("Message saved");

        // AI Reply
        const aiReply = await handleMessageForAI({
          message: trimmedMessage,
          sender: "chat-bot",
        });

        // Send AI reply to everyone in room
        io.to(roomCode).emit("chat:message", aiReply);
      } catch (err) {
        console.error("Failed to handle message:", err);

        socket.emit("chat:error", {
          message: "Failed to process message.",
        });
      }
    });

    // DISCONNECT
    socket.on("disconnect", async (reason) => {
      try {
        console.log(`Socket disconnected: ${senderName}`);

        console.log(`Reason: ${reason}`);

        // Leave room in DB if user disconnects
        if (socket.data.roomCode) {
          const room = await findRoomByCode(socket.data.roomCode);

          if (room) {
            await leaveRoom(room.id, senderUid);

            console.log(
              `User ${senderName} removed from room ${socket.data.roomCode}`,
            );
          }
        }
      } catch (err) {
        console.error("Disconnect cleanup error:", err);
      }
    });
  });
}

export default initWebSocket;
