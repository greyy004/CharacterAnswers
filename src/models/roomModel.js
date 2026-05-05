import pool from "../libs/db.js";

export const createRoomTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS rooms (
      id SERIAL PRIMARY KEY,
      creator_id INTEGER NOT NULL,
      room_code VARCHAR(10) NOT NULL UNIQUE,
      user_count INTEGER NOT NULL DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (creator_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  await pool.query(query);
};