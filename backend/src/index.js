import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import pool from "./db.js";
import {addLocation, getLocation, getLocationByCity} from "./queries/locations.js";
import {addHealthProfile, getHealthProfile} from './queries/health.js';

async function getApi (lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
    }
}

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
}

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
}

app.use(express.json());

app.get('/', (req,res)=>{
    res.send("<h1>Hello World!<h1>");
});

app.post('/health-profile', async (req,res)=>{
    try {
        if (!req.body)
            return res.status(404).json({message: "Health Profile not set up."});
        const {user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score} = req.body;
        const newHealthProfile = await addHealthProfile(user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score);
        res.status(201).json({message: "Health Profile Added!"}); 
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add health profile" });
    }
});

app.get('/health-profile', async (req,res) => {
    const healthProfile = await getHealthProfile();
    res.send(healthProfile[0]);
});

app.post('/location', async (req,res)=>{
    try {
        const { user_id, city, state, lat, lon } = req.body;
        const newLocation = await addLocation( user_id, city, state, lat, lon );
        res.status(201).json({message: "Location Added!"})
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ message: "Failed to add location" });
    }
});

app.get('/locations', async (req,res)=>{
    const locations = await getLocation();
    res.send(locations);
});

app.get('/aqi', async (req,res)=>{
    console.log("AQI route hit ✅");
    const city = req.query.city;
    const location = await getLocationByCity(city);
    if ( !location ) {
        return res.status(404).json({message: "City not found."});
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

    const healthProfiles = await getHealthProfile();
    const healthProfile = healthProfiles[0];
    if ( !healthProfile )
        return res.status(400).json({message: "Health Profile not set up!"});

    const aqiLabel = getAqiLabel ( aqiLevel );
    const riskLevel = calculateRiskLevel ( aqiLevel, healthProfile );
    res.send({aqiLabel, aqiLevel, pollutants, riskLevel }); 
});

app.get("/test-db", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS time");
    res.json({ success: true, time: rows[0].time });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, error: "DB connection failed" });
  }
});

app.listen(8000, ()=>{
    console.log("Server is running.")
});