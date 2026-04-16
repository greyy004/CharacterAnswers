import { createRoom, hasRoom } from '../stores/roomStore.js';

export const createRoomCode = async (req, res) => {
  try {
    const room = createRoom();

    return res.status(201).json({
      data: {
        message: 'room created successfully',
        code: room.code,
        redirectUrl: `/room/${room.code}`
      }
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'error from the server' });
  }
};

export const validateRoom = async (req, res, next) => {
  const roomCode = req.params.roomCode;

  if (!hasRoom(roomCode)) {
    return res.redirect('/');
  }

  return next();
};
