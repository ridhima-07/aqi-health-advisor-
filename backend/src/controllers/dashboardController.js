import { getUserByID } from "../queries/users.js";
import { getHealthProfileByUserID } from "../queries/health.js";
import { getLatestLocationByUserID } from "../queries/locations.js";
import { getAqiReadingsByLocationID, getLatestAqiReadingByLocationID } from "../queries/aqi.js";
import { getApi, getAqiLabel, calculateRiskLevel } from "../utils/aqiUtils.js";

export async function getDashboardData (req, res) {
    const id = req.params.id;
    const user = await getUserByID (id);
    if (!user)
        return res.status(404).json({message: "User not found."})
    const health_profile = await getHealthProfileByUserID (id);
    if (!health_profile)
        return res.status(404).json({message: "Health profile not found."})
    const location = await getLatestLocationByUserID(id);

    const aqis = await getAqiReadingsByLocationID (location.id);
    const aqi = await getLatestAqiReadingByLocationID (location.id);
    const aqiLabel = getAqiLabel (aqi.aqi_level);
    const riskLevel = calculateRiskLevel (aqi.aqi_level, health_profile);
    const exp_score = calcExposureScore (id);
    res.status(200).json({
  user: user,
  healthProfile: health_profile,
  location: location,
  aqi: aqi,
  aqiLabel: aqiLabel,
  riskLevel: riskLevel,
  exposureScore: exp_score,
  aqiHistory: aqis,
})
};