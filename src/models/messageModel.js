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

export const storeMessage = async (sender, message, roomId) => {
  const result = await pool.query(
    `
    Insert into messages (sender_id, content, room_id) Values ($1, $2, $3)
    returning id, content, sender_id
    `,
    [sender, message, roomId]
  );
  return result.rows[0];
};