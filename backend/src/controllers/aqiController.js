import dotenv from "dotenv";
dotenv.config();

import { fetchAqi } from "../services/aqiServices.js";
import {addAqiReading, getAqiReadingsByLocationID, getLatestAqiReadingByLocationID} from "../queries/aqi.js";

export async function fetchAQI (req, res) {
    try {
        console.log("AQI route hit ");
    
        const location_id = req.params.location_id;
        const result = await fetchAqi(location_id);
        if ( !result )
            return res.status(404).json({success: false, message: "Failed to fetch AQI data."});
        res.status(200).json({success: true, data: result});
    } catch (error) {
        console.log(error);
        res.status(500).json({success: false, message: "Failed to fetch AQI data."});
    }
};

export async function getAqiHistory (req, res) {
    try {
        const location_id = req.params.location_id;
        const aqi_history = await getAqiReadingsByLocationID(location_id);
        if (aqi_history.length===0)
            return res.status(404).json({success:false, message: "Aqi history not found."}) ;       
        res.status(200).json({success: true, data: aqi_history});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch AQI history" });
    }
}

export async function getLatestAqi (req, res) {
    try {
        const location_id = req.params.location_id;
        const aqi_latest = await getLatestAqiReadingByLocationID(location_id);
        if (!aqi_latest)
            return res.status(404).json({success: false, message: "Latest aqi not found."});
        res.status(200).json({success: true, data: aqi_latest});
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Failed to fetch latest AQI reading" });
    }
}