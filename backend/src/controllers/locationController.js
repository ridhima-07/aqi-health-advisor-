import {
    addLocation, 
    getLocations, 
    getLocationByID, 
    getLatestLocationByUserID,
    updateLocationByID, 
    deleteLocationByID
} from "../queries/locations.js";
import axios from "axios";

export async function addNewLocation(req, res)
{
    try {
        const { user_id, city, state, pincode } = req.body;
        if (!user_id || !city || !state || !pincode) {
            return res.status(400).json({ success: false, message: "Please fill all location fields.", });
        }
        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ success: false, message: "Please enter a valid 6-digit pincode.", });
        }
        const geoResponse = await axios.get(`https://api.openweathermap.org/geo/1.0/zip?zip=${pincode},IN&appid=${process.env.OP_API_KEY}`);
        const lat = geoResponse.data.lat;
        const lon = geoResponse.data.lon;
        await addLocation( user_id, city, state, pincode, lat, lon);
        return res.status(201).json({ success: true, message: "Location added successfully!", });
    } catch (error) {
        console.error(error);
        if (error.response?.status === 404) {
           return res.status(404).json({ success: false, message: "Invalid pincode or location not found.", });
        }
        return res.status(500).json({ success: false, message: "Unable to fetch location from pincode.", });
    }
};

export async function updateLocation (req, res)
{
    try {
        const id = req.params.id;
        const {city, state, pincode} = req.body;
        if (!/^\d{6}$/.test(pincode))
            return res.status(400).json({ success: false, message: "Please enter a valid 6-digit pincode.",});
        const geoResponse = await axios.get(
            `https://api.openweathermap.org/geo/1.0/zip?zip=${pincode},IN&appid=${process.env.OP_API_KEY}`);
        const lat = geoResponse.data.lat;
        const lon = geoResponse.data.lon;
        const updatedLocation = await updateLocationByID(id, city, state, pincode, lat, lon);
        if (updatedLocation.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Location not found."});
        return res.status(200).json({ success: true, message: "Location updated successfully!"});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to update location."});
    }
};

export async function getAllLocations (req,res) {
    try {
        const locations = await getLocations();
        return res.status(200).json({ success: true, data: locations});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch locations" });
    }
};

export async function getLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const locationByID = await getLocationByID(id);
        if (!locationByID )
            return res.status(404).json({ success: false, message: "Location not found" });
        return res.status(200).json({success: true, data: locationByID});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch location." });
    }
};

export async function getLatestLocation (req, res)
{
    try {
        const user_id = req.params.id;
        const location = await getLatestLocationByUserID(user_id);
        if (!location)
            return res.status(404).json({ success: false, message: "Location not found" });
        return res.status(200).json({ success: true, data: location });
    } catch {
        return res.status(500).json({ success: false, message: "Failed to fetch latest location." });
    }
}

export async function deleteLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const result = await deleteLocationByID(id);
        if ( result.affectedRows===0 )
            return res.status(404).json({ success: false, message: "Location not found."});
        return res.status(200).json({ success: true, message: "Location deleted successfully!"});
    } catch {
        return res.status(500).json({ success: false, message: "Failed to delete location." })
    }
};

