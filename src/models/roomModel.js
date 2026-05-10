import pool from "../libs/db.js";

// CREATE TABLES

export const createRoomTable = async () => {
  // ROOMS TABLE
  await pool.query(`
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      creator_id INTEGER NOT NULL,
      room_code VARCHAR(10) NOT NULL UNIQUE,
      max_users INTEGER NOT NULL DEFAULT 10,
      user_count INTEGER NOT NULL DEFAULT 0,
      status VARCHAR(10) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
};

// ROOM USERS TABLE
export const createRoomUserTable = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS room_users (
      id SERIAL PRIMARY KEY,
      room_id INTEGER NOT NULL,
      user_id INTEGER NOT NULL,
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

      UNIQUE(room_id, user_id)
    );
  `);
};

// CREATE ROOM INDEX
export const createRoomIndex = async () => {
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_room_code ON rooms(room_code);
  `);
};

// CREATE ROOM
export const createRoom = async (creatorId, roomCode) => {
  const result = await pool.query(
    `INSERT INTO rooms (creator_id, room_code)
     VALUES ($1, $2)
     RETURNING id, room_code, creator_id`,
    [creatorId, roomCode],
  );

  return result.rows[0];
};

export const createRoomByUser = createRoom;

// FIND ROOM BY CODE

export const findRoomByCode = async (roomCode) => {
  const result = await pool.query(`SELECT * FROM rooms WHERE room_code = $1`, [
    roomCode,
  ]);

  return result.rows[0];
};

// JOIN ROOM

export const joinRoom = async (roomCode, userId) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const roomResult = await client.query(
      `SELECT *
       FROM rooms
       WHERE room_code = $1
       FOR UPDATE`,
      [roomCode],
    );

    const room = roomResult.rows[0];
    if (!room || room.status !== "active") {
      await client.query("ROLLBACK");
      return null;
    }

    const existing = await client.query(
      `SELECT id
       FROM room_users
       WHERE room_id = $1 AND user_id = $2`,
      [room.id, userId],
    );

    if (existing.rows.length > 0) {
      await client.query("COMMIT");
      return room;
    }

    if (room.user_count >= room.max_users) {
      await client.query("ROLLBACK");
      return null;
    }

    await client.query(
      `INSERT INTO room_users (room_id, user_id)
       VALUES ($1, $2)`,
      [room.id, userId],
    );

    const updatedRoom = await client.query(
      `UPDATE rooms
       SET user_count = user_count + 1
       WHERE id = $1
       RETURNING *`,
      [room.id],
    );

    await client.query("COMMIT");
    return updatedRoom.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// GET USERS IN ROOM

export const getRoomUsers = async (roomId) => {
  const result = await pool.query(
    `
    SELECT u.id, u.username
    FROM room_users ru
    JOIN users u ON u.id = ru.user_id
    WHERE ru.room_id = $1
    `,
    [roomId],
  );

  return result.rows;
};

// LEAVE ROOM
export const leaveRoom = async (roomId, userId) => {
  const result = await pool.query(
    `DELETE FROM room_users
     WHERE room_id = $1 AND user_id = $2
     RETURNING id`,
    [roomId, userId],
  );

  if (result.rowCount === 0) {
    return;
  }

  await pool.query(
    `UPDATE rooms
     SET user_count = GREATEST(user_count - 1, 0)
     WHERE id = $1`,
    [roomId],
  );
};
