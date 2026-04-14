import pool from "../db.js";

export async function createAuthUser(name, email, password) {
  const [result] = await pool.query(
    `INSERT INTO users (name, email, password, dob, gender)
     VALUES (?, ?, ?, NULL, NULL)`,
    [name, email, password]
  );
  return result;
}

export async function updateUserProfile(id, dob, gender) {
  const [result] = await pool.query(
    `UPDATE users
     SET dob = ?, gender = ?
     WHERE id = ?`,
    [dob, gender, id]
  );
  return result;
}

export async function updateUser(id, name, dob, email, gender) {
  const [result] = await pool.query(
    `UPDATE users
     SET name = ?, dob = ?, email = ?, gender = ?
     WHERE id = ?`,
    [name, dob, email, gender, id]
  );
  return result;
}

export async function getUsers() {
  const [users] = await pool.query(`SELECT * FROM users`);
  return users;
}

export async function getUserByID(id) {
  const [user] = await pool.query(`SELECT * FROM users WHERE id = ?`, [id]);
  return user[0];
}

export async function getUserByEmail(email) {
  const [user] = await pool.query(`SELECT * FROM users WHERE email = ?`, [email]);
  return user[0];
}

export async function deleteUserByID(id) {
  const [user] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
  return user;
}