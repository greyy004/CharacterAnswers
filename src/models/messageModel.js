import pool from "../libs/db.js";

export const createMessageTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
      sender_id INTEGER NOT NULL,
      content TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  await pool.query(query);
};
