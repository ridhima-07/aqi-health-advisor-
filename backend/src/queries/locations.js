import pool from "../db.js";

export async function addLocation(user_id, city, state, pincode, lat, lon)
{
    const result = await pool.query(
        `INSERT INTO locations (user_id, city, state, pincode, lat, lon)
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [user_id, city, state, pincode, lat, lon]
    );

    return result.rows[0];
};

export async function getLocations()
{
    const result = await pool.query(`SELECT * FROM locations`);

    return result.rows;
};

export async function getLocationByUserID(user_id)
{
    const result = await pool.query(
        `SELECT * FROM locations WHERE user_id = $1`,
        [user_id]
    );

    return result.rows;
};

export async function getLocationByCity(user_id, city)
{
    const result = await pool.query(
        `SELECT * FROM locations WHERE user_id = $1 AND city = $2`,
        [user_id, city]
    );

    return result.rows[0];
};

export async function getLocationByID(id)
{
    const result = await pool.query(
        `SELECT * FROM locations WHERE id = $1`,
        [id]
    );

    return result.rows[0];
};

export async function getLatestLocationByUserID(user_id)
{
    const result = await pool.query(
        `SELECT * FROM locations
         WHERE user_id = $1
         ORDER BY id DESC
         LIMIT 1`,
        [user_id]
    );

    return result.rows[0];
};

export async function updateLocationByID(id, city, state, pincode, lat, lon)
{
    const result = await pool.query(
        `UPDATE locations
         SET city = $1,
             state = $2,
             pincode = $3,
             lat = $4,
             lon = $5
         WHERE id = $6
         RETURNING *`,
        [city, state, pincode, lat, lon, id]
    );

    return result.rows[0];
};

export async function deleteLocationByID(id)
{
    const result = await pool.query(
        `DELETE FROM locations WHERE id = $1`,
        [id]
    );

    return result;
};