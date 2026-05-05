import pool from "../libs/db.js";

export const createUserTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(query);
};

export const createUser = async ({ username, email, passwordHash }) => {
  const query = `
    INSERT INTO users (username, email, password)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, created_at;
  `;

  const result = await pool.query(query, [username, email, passwordHash]);
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
  const query = `
    SELECT id, username, email, password, created_at
    FROM users
    WHERE email = $1;
  `;

  const result = await pool.query(query, [email]);
  return result.rows[0];
};
