import { dashboardData } from "../services/dashboardServices.js";
import { generateHealthAdvisory } from "../utils/healthAdvisoryUtils.js";
import { generateRecommendations } from "../utils/recommendationsEngine.js";
export async function getDashboardData (req, res) {
    try {
        const user_id = req.params.id;
        const dashboard = await dashboardData(user_id);
        if (!dashboard)
            return res.status(404).json({success: false, message: "Could not load dashboard."});

        const healthAdvisory = generateHealthAdvisory({
            aqiValue: dashboard.aqi.aqiValue,
            aqiLabel: dashboard.aqiLabel,
            pollutants: dashboard.aqi.pollutants,
            health_profile: dashboard.healthProfile,
            exposureScore: dashboard.exposureScore,
            exposureLabel: dashboard.exposureLabel,
        })

        const ctx = {
            user: dashboard.user,
            health_profile: dashboard.healthProfile,
            location: dashboard.location,
            aqiValue: dashboard.aqi.aqiValue,
            aqi_label: dashboard.aqiLabel,
            pollutants: dashboard.aqi.pollutants,
            exp_score: dashboard.exposureScore,
            exp_label: dashboard.exposureLabel,
            };

        const recommendations = generateRecommendations(ctx);
        const nextBestAction = recommendations.length > 0 ? recommendations[0] : null;

        return res.status(200).json({
        success: true,
        message: "Dashboard data fetched successfully.",
        data: {
            ...dashboard,
            healthAdvisory,
            nextBestAction,
            recommendations
        }
        });
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch dashboard data" });
    }
};