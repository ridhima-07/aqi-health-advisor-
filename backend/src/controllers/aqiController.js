import dotenv from "dotenv";
dotenv.config();

import { getLocationByID } from "../queries/locations.js";
import { getHealthProfileByUserID } from "../queries/health.js";

import {
    addAqiReading, 
    getAqiReadingsByLocationID, 
    getLatestAqiReadingByLocationID
} from "../queries/aqi.js";

function getAqiLabel ( aqiLevel )
{
        switch ( aqiLevel )
        {
            case 1: return "Good";
            case 2: return "Fair";
            case 3: return "Moderate";
            case 4: return "Poor";
            case 5: return "Very Poor";
            default: return "Unknown";
        }
};

function calculateRiskLevel ( aqiLevel, healthProfile )
{
    let score = aqiLevel - 1;
    if ( healthProfile.isSmoker ) score += 1;
    if ( healthProfile.hasAllergy ) score += 1;
    if ( healthProfile.hasHeartCondition ) score += 2;
    if ( healthProfile.hasAsthma ) score += 2;
    if ( healthProfile.hasCOPD ) score += 3;
    
    if ( score>=0 && score<=2 )
        return "LOW";
    else if ( score>=3 && score<=5 )
        return "MODERATE";
    else if ( score>=6 && score<=8 )
        return "HIGH";
    else if ( score>=9 )
        return "SEVERE";
    return "UNKNOWN";
};

async function getApi (lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
    }
};

export async function fetchAQI (req, res) {
    console.log("AQI route hit ");
    
    const location_id = req.params.location_id;
    const location = await getLocationByID(location_id);
    if ( !location ) {
        return res.status(400).json({message: "Location not found."});
    }
    const aqi = await getApi(location.lat, location.lon);
    const aqiLevel = aqi.list[0].main.aqi;
    const pollutants = aqi.list[0].components;

    const pm25 = pollutants.pm2_5;
    const pm10 = pollutants.pm10;
    const co = pollutants.co;
    const no2 = pollutants.no2;
    const o3 = pollutants.o3;
    const so2 = pollutants.so2;
    const nh3 = pollutants.nh3;

    await addAqiReading(location_id, aqiLevel, co, no2, o3, so2, pm25, pm10, nh3);

    const healthProfileByUserID = await getHealthProfileByUserID(location.user_id);
    if ( !healthProfileByUserID )
        return res.status(400).json({message: "Health Profile not set up!"});

    const aqiLabel = getAqiLabel ( aqiLevel );
    const riskLevel = calculateRiskLevel ( aqiLevel, healthProfileByUserID );
    res.send({aqiLabel, aqiLevel, pollutants, riskLevel });
};

export async function getAqiHistory (req, res) {
    try {
        const location_id = req.params.location_id;
        const aqiHistory = await getAqiReadingsByLocationID(location_id);
        res.send(aqiHistory);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch AQI history" });
    }
}

export async function getLatestAqi (req, res) {
    try {
        const location_id = req.params.location_id;
        const aqiLatest = await getLatestAqiReadingByLocationID(location_id);
        res.send(aqiLatest);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch latest AQI reading" });
    }
}