import pool from "../db";

async function addHealthProfile (isSmoker, hasAllergy, hasAsthma, hasCOPD, hasCOPD) {
    const newHealthProfile = await pool.query('INSERT into health_profiles')
};