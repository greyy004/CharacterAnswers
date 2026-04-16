import { createRoom, hasRoom } from '../stores/roomStore.js';

export async function createRoomHandler(req, res) {
  try {
    const room = createRoom();

    return res.status(201).json({
      data: {
        message: 'Room created successfully.',
        code: room.code,
        redirectUrl: `/room/${room.code}`
      }
    });
  } catch (error) {
    console.error('Failed to create room:', error);
    return res.status(500).json({ message: 'Error creating room.' });
  }
}

export async function validateRoom(req, res, next) {
  const roomCode = String(req.params.roomCode || '').toUpperCase();

  if (!hasRoom(roomCode)) {
    return res.redirect('/');
  }

  return next();
}
