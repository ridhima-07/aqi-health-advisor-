import pool from "../db.js";

export async function addHealthProfile(
    user_id,
    isSmoker,
    hasHeartCondition,
    hasAsthma,
    hasCOPD,
    hasAllergy,
    health_score
)
{
    const result = await pool.query(
        `INSERT INTO health_profiles
        (user_id, "isSmoker", "hasHeartCondition", "hasAsthma", "hasCOPD", "hasAllergy", health_score)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *`,
        [
            user_id,
            isSmoker,
            hasHeartCondition,
            hasAsthma,
            hasCOPD,
            hasAllergy,
            health_score
        ]
    );

    return result.rows[0];
};

export async function getHealthProfile()
{
    const result = await pool.query(`SELECT * FROM health_profiles`);

    return result.rows;
};

export async function getHealthProfileByUserID(user_id)
{
    const result = await pool.query(
        `SELECT * FROM health_profiles WHERE user_id = $1`,
        [user_id]
    );

    return result.rows[0];
};

export async function updateHealthProfileByUserID(
    user_id,
    isSmoker,
    hasHeartCondition,
    hasAsthma,
    hasCOPD,
    hasAllergy,
    health_score
)
{
    const result = await pool.query(
        `UPDATE health_profiles
        SET "isSmoker" = $1,
            "hasHeartCondition" = $2,
            "hasAsthma" = $3,
            "hasCOPD" = $4,
            "hasAllergy" = $5,
            health_score = $6
        WHERE user_id = $7
        RETURNING *`,
        [
            isSmoker,
            hasHeartCondition,
            hasAsthma,
            hasCOPD,
            hasAllergy,
            health_score,
            user_id
        ]
    );

    return result.rows[0];
};

export async function deleteHealthProfileByUserID(user_id)
{
    const result = await pool.query(
        `DELETE FROM health_profiles WHERE user_id = $1`,
        [user_id]
    );

    return result;
};