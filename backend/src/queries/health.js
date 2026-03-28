import pool from "../db.js";

export async function addHealthProfile (user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score) {
    const [newHealthProfile] = await pool.query(`INSERT into health_profiles (user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score) 
        VALUES ( ?, ?, ?, ?, ?, ?, ? ) `, [user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score]);
        console.log("DB Insert Result:", newHealthProfile);
        return newHealthProfile;
};

export async function getHealthProfile () {
    const [healthProfile] = await pool.query(`SELECT * FROM health_profiles`);
    return healthProfile;
}