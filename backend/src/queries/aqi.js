import pool from "../db.js";

export async function addAqiReading(
    location_id,
    aqi_level,
    co,
    no2,
    o3,
    so2,
    pm2_5,
    pm10,
    nh3
)
{
    const result = await pool.query(
        `INSERT INTO aqi_readings
        (location_id, aqi_level, co, no2, o3, so2, pm2_5, pm10, nh3)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *`,
        [
            location_id,
            aqi_level,
            co,
            no2,
            o3,
            so2,
            pm2_5,
            pm10,
            nh3
        ]
    );

    return result.rows[0];
};

export async function getAqiReadingsByLocationID(location_id)
{
    const result = await pool.query(
        `
        SELECT *
        FROM (
            SELECT *
            FROM aqi_readings
            WHERE location_id = $1
            ORDER BY created_at DESC
            LIMIT 8
        ) latest
        ORDER BY created_at ASC
        `,
        [location_id]
    );

    return result.rows;
}

export async function getLatestAqiReadingByLocationID(location_id)
{
    const result = await pool.query(
        `SELECT *
         FROM aqi_readings
         WHERE location_id = $1
         ORDER BY created_at DESC
         LIMIT 1`,
        [location_id]
    );

    return result.rows[0];
};