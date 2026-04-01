import { getUserByID } from "../queries/users.js";
import { getHealthProfileByUserID } from "../queries/health.js";
import { getLatestLocationByUserID } from "../queries/locations.js";
import { getAqiLabel, calculateRiskLevel } from "../utils/aqiUtils.js";
import { calcExposureScore, calcExposureLabel } from "../utils/exposureUtils.js";
import { fetchAqi } from "../services/aqiServices.js";
import { getAqiReadingsByLocationID } from "../queries/aqi.js";

export async function dashboardData (user_id)
{
    try {
        const user = await getUserByID(user_id);
        if (!user) return null;
        const health_profile = await getHealthProfileByUserID(user_id);
        if (!health_profile) return null;
        const location = await getLatestLocationByUserID(user_id);
        if (!location) return null;
        const location_id = location.id;

        const live_aqi = await fetchAqi(location_id);
        if (!live_aqi) return null;

        const aqis = await getAqiReadingsByLocationID(location_id);
        const aqiLabel = getAqiLabel (live_aqi.aqi_level);
        const riskLevel = calculateRiskLevel (live_aqi.aqi_level, health_profile);
        const exp_score = calcExposureScore (live_aqi.aqi_level, health_profile);
        const exp_label = calcExposureLabel (exp_score);
        return(     {user: user,
                    healthProfile: health_profile,
                    location: location,
                    aqi: live_aqi,
                    aqiLabel: aqiLabel,
                    riskLevel: riskLevel,
                    exposureScore: exp_score,
                    exposureLabel: exp_label,
                    aqiHistory: aqis});
    } catch (error) {
        console.log(error);
    }
}