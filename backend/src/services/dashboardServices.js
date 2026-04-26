import { getUserByID } from "../queries/users.js";
import { getHealthProfileByUserID } from "../queries/health.js";
import { getLatestLocationByUserID } from "../queries/locations.js";
import { getAqiLabel, getAqiBandLabel, calculateRiskLevel } from "../utils/aqiUtils.js";
import { calcExposureScore, calcExposureLabel } from "../utils/exposureUtils.js";
import { fetchAndStoreLatestAqi, getLatestAqi } from "../services/aqiServices.js";
import { getAqiReadingsByLocationID } from "../queries/aqi.js";
import { calcAQINumber } from "../utils/aqiNumberUtils.js";

function getCigaretteEquivalent(aqi) {
  if (aqi <= 50) return "0 cigarettes";
  if (aqi <= 100) return "~1 cigarette";
  if (aqi <= 150) return "~2–3 cigarettes";
  if (aqi <= 200) return "~4–6 cigarettes";
  return "7+ cigarettes";
}

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

        let live_aqi = await getLatestAqi(location_id);

        if (!live_aqi) {
        live_aqi = await fetchAndStoreLatestAqi(location_id);
        }

        const cigaretteEquivalent = getCigaretteEquivalent(live_aqi?.aqiValue || 0);

        const aqis = await getAqiReadingsByLocationID(location_id);

        const normalizedAqiHistory = aqis.map((item) => {
        const rawPollutants = {
            co: item.co,
            no2: item.no2,
            o3: item.o3,
            so2: item.so2,
            pm2_5: item.pm2_5,
            pm10: item.pm10,
            nh3: item.nh3,
            };

        const pollutantsForCalc = {
            ...rawPollutants,
            co: rawPollutants.co / 1000,
            };

        const aqiCalc = calcAQINumber(pollutantsForCalc);

        return {
            id: item.id,
            aqi_level: item.aqi_level,
            aqiValue: aqiCalc.aqiValue,
            dominantPollutant: aqiCalc.dominantPollutant,
            pollutants: rawPollutants,
            fetchedAt: item.created_at,
            };
        });

        const aqiLabel = getAqiBandLabel (live_aqi.aqiValue);
        const riskLevel = calculateRiskLevel(live_aqi.aqiValue, health_profile);
        const exp_score = calcExposureScore(live_aqi.aqiValue, health_profile);
        const exp_label = calcExposureLabel (exp_score);
        return(     {user: user,
                    healthProfile: health_profile,
                    location: location,
                    aqi: live_aqi,
                    aqiLabel: aqiLabel,
                    cigaretteEquivalent: cigaretteEquivalent,
                    riskLevel: riskLevel,
                    exposureScore: exp_score,
                    exposureLabel: exp_label,
                    aqiHistory: normalizedAqiHistory});
    } catch (error) {
        console.log(error);
        return null;
    }
}