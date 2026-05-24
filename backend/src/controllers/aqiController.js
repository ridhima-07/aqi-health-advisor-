import { fetchAndStoreLatestAqi, getLatestAqi as getLatestAqiService, fetchAqiByCity } from "../services/aqiServices.js";
import { getAqiReadingsByLocationID } from "../queries/aqi.js";

export async function fetchAQI(req, res) {
  try {
    const location_id = req.params.location_id;
    const result = await fetchAndStoreLatestAqi(location_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Failed to fetch AQI data.",
      });
    }

    return res.status(200).json({ success: true, message: "AQI fetched successfully.", data: result });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch AQI data." });
  }
}

export async function getAqiHistory (req, res) {
    try {
        const location_id = req.params.location_id;
        const aqi_history = await getAqiReadingsByLocationID(location_id);
        if (aqi_history.length===0)
            return res.status(404).json({success:false, message: "Aqi history not found."}) ;       
        return res.status(200).json({success: true, message: "AQI history fetched successfully.", data: aqi_history});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch AQI history" });
    }
};

export async function getLatestAqi(req, res) {
  try {
    const location_id = req.params.location_id;
    const result = await getLatestAqiService(location_id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: "Latest AQI not found.",
      });
    }
    return res.status(200).json({ success: true, message: "Latest AQI fetched successfully.", data: result });
  } catch {
    return res.status(500).json({ success: false, message: "Failed to fetch latest AQI reading" });
  }
}

export async function getAqiByCity(req, res) {
  try {
    const cityName = req.query.name;
    if (!cityName || !cityName.trim()) {
      return res.status(400).json({ success: false, message: "City name is required.", });
    }
    const result = await fetchAqiByCity(cityName.trim());
    return res.status(200).json({ success: true, message: "AQI fetched successfully.", data: result });
  } catch (error) {
    if (error.message === "Location not found") {
      return res.status(404).json({ success: false, message: "Location not found." });
    }
    return res.status(500).json({ success: false, message: "Failed to fetch AQI for this location." });
  }
}