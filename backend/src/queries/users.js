import pool from "../db.js";

export async function createAuthUser(name, email, password) {
  const result = await pool.query(
    `INSERT INTO users (name, email, password, dob, gender)
     VALUES ($1, $2, $3, NULL, NULL)
     RETURNING *`,
    [name, email, password]
  );

  return result.rows[0];
}

export async function updateUserProfile(id, dob, gender) {
  const result = await pool.query(
    `UPDATE users
     SET dob = $1, gender = $2
     WHERE id = $3
     RETURNING *`,
    [dob, gender, id]
  );

  return result.rows[0];
}

export async function updateUser(id, name, dob, email, gender) {
  const result = await pool.query(
    `UPDATE users
     SET name = $1, dob = $2, email = $3, gender = $4
     WHERE id = $5
     RETURNING *`,
    [name, dob, email, gender, id]
  );

  return result.rows[0];
}

export async function getUsers() {
  const result = await pool.query(`SELECT * FROM users`);

  return result.rows;
}

export async function getUserByID(id) {
  const result = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );

  return result.rows[0];
}

export async function getUserByEmail(email) {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return result.rows[0];
}

export async function deleteUserByID(id) {
  const result = await pool.query(
    `DELETE FROM users WHERE id = $1`,
    [id]
  );

  return result;
}