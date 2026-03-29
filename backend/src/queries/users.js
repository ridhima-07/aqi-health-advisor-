import pool from "../db.js";

export async function createUser (name, dob, email, gender)
{
    const [newUser] = await pool.query(`INSERT INTO users (name, dob, email, gender)
        VALUES (?, ?, ?, ?)`, [name, dob, email, gender]);
    return newUser;
};

export async function updateUser (id, name, dob, email, gender)
{
    const [updateUser] = await pool.query( `UPDATE users 
        SET name = ?, dob = ?, email = ?, gender = ? WHERE id = ?`, [name, dob, email, gender, id]);
    return updateUser;
}

export async function getUsers() 
{
    const [users] = await pool.query(`SELECT * FROM users`);
    return users;
};

export async function getUserByID (id)
{
    const [user] = await pool.query(`SELECT * FROM users WHERE id=?`, [id]);
    return user[0];
};

export async function getUserByEmail (email)
{
    const [user] = await pool.query(`SELECT * FROM users WHERE email=?`, [email]);
    return user[0];
};

export async function deleteUserByID (id) 
{
    const [user] = await pool.query(`DELETE FROM users WHERE id = ?`, [id]);
    return user;
}

