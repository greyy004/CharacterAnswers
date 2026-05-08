import { createRoomByUser, joinRoomByUser } from "../models/roomModel.js";
import crypto from 'crypto';

function generateRoomCode() {
  return crypto.randomBytes(4).toString('hex').toUpperCase().slice(0, 6);
}

export const createRoom = async (req, res) => {
  try {
    const creatorId = Number(req.user.uid);
    const room = await createRoomByUser(creatorId, generateRoomCode());

    return res.status(201).json({
        message: 'Room created successfully.',
        code: room.room_code
    });
  } catch (error) {
    console.error('Failed to create room:', error);
    return res.status(500).json({ message: 'Error creating room.' });
  }
};

export const joinRoom = async (req, res) => {
  const code = String(req.params.code || '').toUpperCase();
  try {
    const userId = Number(req.user.uid);
    const room = await joinRoomByUser(code, userId);
    if (!room) {
      return res.status(404).json({ message: 'Room not found.' });
    }
    return res.sendFile('public/html/terminal.html', { root: '.' });
  } catch (error) {
    console.error('Failed to join room:', error);
    return res.status(404).json({ message: 'Room not found.' });
  }
};
