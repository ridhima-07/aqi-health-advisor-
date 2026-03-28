import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import pool from "./db.js";
import {addLocation, getLocations, getLocationByCity, getLocationByUserID, getLocationByID, updateLocationByID, deleteLocationByID} from "./queries/locations.js";
import {addHealthProfile, getHealthProfile, getHealthProfileByUserID, updateHealthProfileByUserID, deleteHealthProfileByUserID} from './queries/health.js';
import {addAqiReading, getAqiReadingsByLocationID, getLatestAqiReadingByLocationID} from "./queries/aqi.js";

async function getApi (lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.API_KEY}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
    }
};

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

app.use(express.json());

app.get('/', (req,res)=>{
    res.send("<h1>Hello World!<h1>");
});

app.post('/health-profile', async (req,res)=>{
    try {
        if (!req.body)
            return res.status(404).json({message: "Health Profile not set up."});
        const {user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy} = req.body;
        const health_score = calculateHealthScore ( isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy );
        const newHealthProfile = await addHealthProfile(user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score);
        res.status(201).json({message: "Health Profile Added!"}); 
    } catch(error) {
        console.log(error);
        res.status(500).json({ message: "Failed to add health profile :(" });
    }
});

app.put('/health-profile', async(req,res)=>{
    try {
        if (!req.body)
            return res.status(404).json({message: "Health Profile not added."});
        const {user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy} = req.body; 
        const health_score = calculateHealthScore ( isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy );
        const updatedHealthProfile = await updateHealthProfileByUserID(user_id, isSmoker, hasHeartCondition, hasAsthma, hasCOPD, hasAllergy, health_score);
        res.status(201).json({message: "Health Profile updated successfully!"});
    } catch ( error ){
        console.log(error);
        res.status(500).json({message: "Failed to update health profile :("});
    }
});

app.get('/health-profile/:id', async (req,res)=>{
    const user_id = req.params.id;
    const healthProfileByUserID = await getHealthProfileByUserID ( user_id );
    res.send(healthProfileByUserID);
});

app.get('/health-profiles', async (req,res) => {
    const healthProfile = await getHealthProfile();
    res.send(healthProfile);
});

app.delete('/health-profile/:id', async (req, res)=>{
    try {
        const user_id = req.params.id;
        const result = await deleteHealthProfileByUserID(user_id);
        if ( result.affectedRows === 0 )
            return res.status(400).json({message: "Health Profile not found"});
        return res.status(200).json({message: "Health profile deleted successfully!"});
    } catch ( error ) {
        res.status(500).json({message: "Failed to delete health profile."});
    }
});

app.post('/location', async (req,res)=>{
    try {
        const { user_id, city, state, lat, lon } = req.body;
        const newLocation = await addLocation( user_id, city, state, lat, lon );
        res.status(200).json({message: "Location Added!"})
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ message: "Failed to add location" });
    }
});

app.put('/location/:id', async (req,res)=>{
    try {
        const id = req.params.id;
        const {city, state, lat, lon} = req.body;
        const updatedLocation = await updateLocationByID(id, city, state, lat, lon);
        if (updatedLocation.affectedRows === 0)
            return res.status(404).json({message: "Location not found."});
        return res.status(200).json({message: "Location updated succesfully!"});
    } catch (error){
        console.log(error);
        res.status(500).json({message: "Failed to update location."});
    }
});

app.get("/location/:id", async(req,res)=>{
    const id = req.params.id;
    const locationByID = await getLocationByID(id);
    res.send(locationByID);
});

app.delete("/location/:id", async(req,res)=>{
    try {
        const id = req.params.id;
        const result = await deleteLocationByID(id);
        if ( result.affectedRows===0 )
            return res.status(400).json({message: "Location not found."});
        return res.status(200).json({message: "Location deleted successfully!"});
    } catch(error) {
        res.status(500).json({message: "Failed to delete location." })
    }
});

app.get('/locations', async (req,res)=>{
    const locations = await getLocations();
    res.send(locations);
});



app.get('/aqi/fetch/:location_id', async (req,res)=>{
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
});

app.get('/aqi-history/:location_id', async (req,res)=>{
    const location_id = req.params.location_id;
    const aqiHistory = await getAqiReadingsByLocationID(location_id);
    res.send(aqiHistory);
});

app.get('/aqi-latest/:location_id', async(req,res)=>{
    const location_id = req.params.location_id;
    const aqiLatest = await getLatestAqiReadingByLocationID(location_id);
    res.send(aqiLatest);
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