import { customAlphabet } from 'nanoid';

export const rooms = new Map();
export const MAX_USERS_PER_ROOM = 4;

const generateRoomCode = customAlphabet(
  'ABCDEFGHJKLMNPQRSTUVWXYZ23456789',
  6
);

export function createRoom() {
  let code = generateRoomCode();

  while (rooms.has(code)) {
    code = generateRoomCode();
  }

  const room = {
    userCount: 0,
    code,
    createdAt: new Date().toISOString()
  };

  rooms.set(room.code, room);
  return room;
}

export function getRoom(code) {
  return rooms.get(String(code || '').toUpperCase()) || null;
}

export function hasRoom(code) {
  return rooms.has(String(code || '').toUpperCase());
}

export function deleteRoom(code){
  rooms.delete(String(code || '').toUpperCase());
}

export function userCountCheck(code) {
  const room = getRoom(code);
  return room?.userCount ?? 0;
}

export function isRoomFull(code) {
  return userCountCheck(code) >= MAX_USERS_PER_ROOM;
}

export function incrementUserCount(code) {
  const room = getRoom(code);

  if (!room || room.userCount >= MAX_USERS_PER_ROOM) {
    return null;
  }

  room.userCount += 1;
  return room.userCount;
}

export function decrementUserCount(code) {
  const room = getRoom(code);

  if (!room) {
    return null;
  }

  room.userCount = Math.max(0, room.userCount - 1);
  return room.userCount;
}
