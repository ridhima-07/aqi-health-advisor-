import pool from "../db.js";

export async function addLocation (user_id, city, state, lat, lon )
{
    const [newLocation] = await pool.query(`INSERT into locations (user_id, city, state, lat, lon)
       VALUES  ( ? , ? , ? , ? , ? )`,[user_id, city, state, lat,lon]);
    return newLocation;
};

export async function getLocations () 
{
    const [rows] = await pool.query(`SELECT * FROM locations`);
    return rows;
};

export async function getLocationByUserID ( user_id )
{
    const [locationByUserID] = await pool.query(`SELECT * FROM locations WHERE user_id = ?`, [user_id]);
    return locationByUserID; 
};

export async function getLocationByCity (user_id, city) 
{
    const [locationByCity] = await pool.query(`SELECT * FROM locations WHERE user_id = ? AND city=?`, [user_id, city]);
    return locationByCity[0];
};

export async function getLocationByID ( id )
{
    const [locationByID] = await pool.query ( `SELECT * FROM locations WHERE id = ?`, [id]);
    return locationByID[0];
};

export async function updateLocationByID ( id, city, state, lat, lon )
{
    const [updatedLocation] = await pool.query(`UPDATE locations 
        SET city = ?, state = ?, lat = ?, lon = ?
        WHERE id = ?`, [city, state, lat, lon, id]);
    return updatedLocation;
};

export async function deleteLocationByID ( id )
{
    const [deletedLocation] = await pool.query(`DELETE FROM locations WHERE id = ?`, [id]);
    return deletedLocation;
};

