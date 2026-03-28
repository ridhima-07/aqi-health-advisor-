import pool from "../db.js";

export async function addHealthProfile (user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score) 
{
    const [newHealthProfile] = await pool.query(`INSERT into health_profiles (user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score) 
        VALUES ( ?, ?, ?, ?, ?, ?, ? ) `, [user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score]);
        console.log("DB Insert Result:", newHealthProfile);
        return newHealthProfile;
};

export async function getHealthProfile () 
{
    const [healthProfile] = await pool.query(`SELECT * FROM health_profiles`);
    return healthProfile;
}

export async function getHealthProfileByUserID ( user_id )
{
    const [rows] = await pool.query(`SELECT * FROM health_profiles WHERE user_id = ?`, [user_id]);
    return rows[0];
}

export async function updateHealthProfileByUserID (user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score)
{
    const [updatedHealthProfile] = await pool.query(`UPDATE health_profiles 
        SET isSmoker = ?, hasHeartCondition = ?, hasAsthma = ?, hasCOPD = ?, hasAllergy = ?, health_score = ?
        WHERE user_id = ?`, [isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score, user_id]);
    return updatedHealthProfile;
}

export async function deleteHealthProfileByUserID ( user_id )
{
    const [healthProfile] = await pool.query(`DELETE FROM health_profiles WHERE user_id = ?`, [user_id]);
    return healthProfile;
}