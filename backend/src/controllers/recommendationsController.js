import { generateRecommendations } from "../utils/recommendationsEngine.js";
import { dashboardData } from "../services/dashboardServices.js";

export async function nextBestAction (req, res)
{
    try {
        const user_id = req.params.id;
        const data = await dashboardData(user_id);

        if (!data)
            return res.status(404).json({ success: false, message: "Could not load recommendation data." });

        const ctx = {
            user: data.user,
            health_profile: data.healthProfile,
            location: data.location,
            aqi_level: data.aqi.aqi_level,
            aqi_label: data.aqiLabel,
            pollutants: data.aqi.pollutants,
            exp_score: data.exposureScore,
            exp_label: data.exposureLabel
            };

        const recommendations = generateRecommendations(ctx);

        return res.status(200).json({success: true, data: {...ctx, recommendations}});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to show recommendations" });
    }
}

