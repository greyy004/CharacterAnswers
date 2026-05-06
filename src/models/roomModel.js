import pool from "../libs/db.js";

export const createRoomTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      creator_id INTEGER NOT NULL,
      room_code VARCHAR(10) NOT NULL UNIQUE,
      user_count INTEGER NOT NULL DEFAULT 0,
      status varchar(10) NOT NULL DEFAULT 'active',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  await pool.query(query);
};

export const createRoomByUser = async (creatorId, roomCode) => {
  const query = `
    INSERT INTO rooms (creator_id, room_code)
    VALUES ($1, $2)
    RETURNING id, room_code;
  `;

  const values = [creatorId, roomCode];
  const result = await pool.query(query, values);
  console.log('Created room:', result.rows[0]);
  return result.rows[0];
}

export const joinRoomByUser = async (roomCode) => {
  const query = `
    SELECT id, room_code FROM rooms
    WHERE room_code = $1;
  `;
  const values = [roomCode];
  const result = await pool.query(query, values);
  return result.rows[0];
}