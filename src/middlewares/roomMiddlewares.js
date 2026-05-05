import { hasRoom, isRoomFull, userCountCheck } from '../stores/roomStore.js';

export async function validateRoom(req, res, next) {
  const roomCode = String(req.params.roomCode || '').toUpperCase();
  console.log('Total users: ', userCountCheck(roomCode));
  if (!hasRoom(roomCode) || isRoomFull(roomCode)) {
    return res.redirect('/');
  }

  return next();
}
