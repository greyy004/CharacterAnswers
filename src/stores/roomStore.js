import crypto from 'crypto';

const rooms = new Map();
const ROOM_CODE_LENGTH = 6;
const ROOM_CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

function generateRoomCode(length = ROOM_CODE_LENGTH) {
  let code = '';

  while (code.length < length) {
    const randomBytes = crypto.randomBytes(length);

    for (const byte of randomBytes) {
      code += ROOM_CODE_ALPHABET[byte % ROOM_CODE_ALPHABET.length];

      if (code.length === length) {
        break;
      }
    }
  }

  return code;
}

export function createRoom() {
  let code = generateRoomCode();

  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const room = {
    code,
    createdAt: new Date().toISOString()
  };

  rooms.set(code, room);
  return room;
}

export function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase()) || null;
}

export function hasRoom(code) {
  return rooms.has(String(code || '').toUpperCase());
}
