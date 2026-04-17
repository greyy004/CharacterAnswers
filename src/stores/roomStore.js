import { customAlphabet } from 'nanoid';

export const rooms = new Map();

const generateRoomCode = customAlphabet(
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  6
);

const code = generateRoomCode();


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
