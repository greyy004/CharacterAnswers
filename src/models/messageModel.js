import pool from "../libs/db.js";

export const createMessageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      room_id INTEGER NOT NULL,
      sender_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  await pool.query(query);
};

export const createMessageIndex = async () => {
  const query = `
    CREATE INDEX IF NOT EXISTS idx_room_id
    ON messages(room_id);
  `;

  await pool.query(query);
};