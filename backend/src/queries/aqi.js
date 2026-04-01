import pool from "../db.js";

export async function addAqiReading ( location_id, aqi_level, co, no2, o3, so2, pm2_5, pm10, nh3 )
{
    const [newAqiReading] = await pool.query(`INSERT into aqi_readings (location_id, aqi_level, co, no2, o3, so2, pm2_5, pm10, nh3 )
        VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ? ) `,[location_id, aqi_level, co, no2, o3, so2, pm2_5, pm10, nh3]);
    return newAqiReading;
};

export async function getAqiReadingsByLocationID ( location_id )
{
    const [aqiReadingByLocationID] = await pool.query(`SELECT * FROM aqi_readings WHERE location_id = ? ORDER BY created_at DESC`, [location_id]);
    return aqiReadingByLocationID;
};

export async function getLatestAqiReadingByLocationID (location_id)
{
    const [aqiReadingByLocationID] = await pool.query(`SELECT * FROM aqi_readings WHERE location_id = ? 
        ORDER BY created_at DESC 
        LIMIT 1`, [location_id]);
    return aqiReadingByLocationID[0];
};