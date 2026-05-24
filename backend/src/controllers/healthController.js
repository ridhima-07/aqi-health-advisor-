import {
    addHealthProfile, 
    getHealthProfile, 
    getHealthProfileByUserID, 
    updateHealthProfileByUserID, 
    deleteHealthProfileByUserID
} from '../queries/health.js';

function calculateHealthScore (isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy)
{
    let score = 0;
    if ( isSmoker ) score += 2;
    if ( hasHeartCondition ) score += 3;
    if ( hasAsthma ) score += 3;
    if ( hasCOPD ) score += 4;
    if ( hasAllergy ) score += 1;

    return score;
};

export async function createHealthProfile ( req, res )
{
    try {
        if (!req.body)
            return res.status(400).json({ success: false, message: "Health Profile not set up."});
        const {user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy} = req.body;
        const health_score = calculateHealthScore ( isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy );
        await addHealthProfile(user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score);
        return res.status(201).json({ success: true, message: "Health Profile Added!"}); 
    } catch {
        return res.status(500).json({ success: false, message: "Failed to add health profile :(" });
    }
};

export async function updateHealthProfile ( req, res )
{
    try {
        const {user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy} = req.body; 
        const health_score = calculateHealthScore ( isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy );
        const updatedHealthProfile = await updateHealthProfileByUserID(user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score);
        if (updatedHealthProfile.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Health Profile not found."});
        return res.status(200).json({ success: true, message: "Health Profile updated successfully!"});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to update health profile :("});
    }
};

export async function getAllHealthProfiles ( req, res )
{
    try { 
        const health_profile = await getHealthProfile();
        if (!health_profile)
            return res.status(404).json({success: false, message: "Health profile not found."})
        return res.status(200).json({ success: true, data: health_profile});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch health profiles."});
    }
};

export async function getHealthProfileByUserIDController ( req, res )
{
    try { 
        const user_id = req.params.id;
        const healthProfileByUserID = await getHealthProfileByUserID ( user_id );
        if (!healthProfileByUserID)
            return res.status(404).json({ success: false, message: "Health profile not found" });
        return res.status(200).json({ success: true, data: healthProfileByUserID});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch health profile" });
    }
};

export async function deleteHealthProfile ( req, res )
{
    try {
        const user_id = req.params.id;
        const result = await deleteHealthProfileByUserID(user_id);
        if ( result.affectedRows === 0 )
            return res.status(404).json({ success: false, message: "Health Profile not found"});
        return res.status(200).json({ success: true, message: "Health profile deleted successfully!"});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to delete health profile."});
    }
};

