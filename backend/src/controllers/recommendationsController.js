import {getApi, getAqiLabel} from "../utils/aqiUtils.js";
import { getUserByID } from "../queries/users.js";
import { getHealthProfileByUserID } from "../queries/health.js";
import { getLocationByUserID } from "../queries/locations.js";
import { generateRecommendations } from "../utils/recommendationsEngine.js";
import dotenv from "dotenv";
dotenv.config();

export async function getData (user_id) 
{
    const user = await getUserByID(user_id);
    if (!user) return null;

    const health_profile = await getHealthProfileByUserID(user_id);
    if (!health_profile) return null;

    const location = await getLatestLocationByUserID(user_id);
    if (!location) return null;

    const aqi_data = await getApi(location.lat, location.lon);
    const aqi_level = aqi_data.list[0].main.aqi;
    const pollutants = aqi_data.list[0].components;
    return {user, location, aqi_level, pollutants, health_profile};
}

export function aqiBase ( aqi_level )
{
    switch (aqi_level)
    {
        case 1: return 10;
        case 2: return 25;
        case 3: return 45;
        case 4: return 70;
        case 5: return 90;
        default: return 0;
    }
}

export async function calcExposureScore (user_id)
{
    const data = await getData (user_id);
    let score2 = 0;
    
    if (data.health_profile.isSmoker) score2+=10;
    if (data.health_profile.hasAllergy) score2+=5;
    if (data.health_profile.hasAsthma) score2+=15;
    if (data.health_profile.hasHeartCondition) score2+=15;
    if (data.health_profile.hasCOPD) score2+=20;

    const score1 = aqiBase(data.aqi_level);

    let exp_score = score1 + score2;

    if ( exp_score>=100 ) exp_score = 100;

    return exp_score;
}

export async function calcExposureLabel (exp_score)
{
    if ( exp_score >=0 && exp_score <=20 )
        return "Safe";
    else if ( exp_score>=21 && exp_score<=40 )
        return "Slight risk";
    else if ( exp_score>=41 && exp_score<=60 )
        return "Moderate risk";
    else if ( exp_score>=61 && exp_score<=80 )
        return "High risk";
    else if ( exp_score>=81 && exp_score<=100 )
        return "Dangerous";
}

export async function nextBestAction (req, res)
{
    const user_id = req.params.id;
    const data = await getData(user_id);
    if (!data) return res.status(404).json({message:"Dashboard data not found"});

    const {user, location, aqi_level, pollutants, health_profile} = data;
    const exp_score = await calcExposureScore(user_id);
    const aqi_label = getAqiLabel(aqi_level);
    const exp_label = await calcExposureLabel (exp_score);

    const ctx = {
    user,
    health_profile,
    location,
    aqi_level,
    aqi_label,
    pollutants,
    exp_score,
    exp_label
  };

  const recommendations = generateRecommendations(ctx);

  return res.status(200).json({user, health_profile, location, aqi_level, aqi_label, pollutants, exp_score, exp_label, recommendations});
}

