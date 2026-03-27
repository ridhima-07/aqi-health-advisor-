import pool from "../db.js";

export async function addLocation (user_id, city, state, lat, lon )
{
    const [newLocation] = await pool.query(`INSERT into locations (user_id, city, state, lat, lon)
       VALUES  ( ? , ? , ? , ? , ? )`,[user_id, city, state, lat,lon]);
    return newLocation
};

export async function getLocation () 
{
    const [rows] = await pool.query(`SELECT * FROM locations`);
    return rows;
}

export async function getLocationByCity (city) 
{
    const [location] = await pool.query(`SELECT * FROM locations WHERE city=?`, [city]);
    return location[0];
}

export default {addLocation, getLocation, getLocationByCity};