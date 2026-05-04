import { hasRoom, isRoomFull } from '../stores/roomStore.js';

export async function validateRoom(req, res, next) {
  const roomCode = String(req.params.roomCode || '').toUpperCase();

  if (!hasRoom(roomCode) || isRoomFull(roomCode)) {
    return res.redirect('/');
  }

  return next();
}
