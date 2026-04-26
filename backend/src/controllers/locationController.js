import {
    addLocation, 
    getLocations, 
    getLocationByCity, 
    getLocationByUserID, 
    getLocationByID, 
    getLatestLocationByUserID,
    updateLocationByID, 
    deleteLocationByID
} from "../queries/locations.js";

export async function addNewLocation (req, res) {
    try {
        const { user_id, city, state, lat, lon } = req.body;
        if (!user_id || !city || !state || lat==null || lon==null)
            return res.status(400).json({success: false, message: "Failed to add location"});
        const newLocation = await addLocation( user_id, city, state, lat, lon );
        res.status(201).json({success: true, message: "Location Added!"})
    } catch ( error ) {
        res.status(500).json({ success: false, message: "Failed to add location" });
    }
};

export async function updateLocation (req, res)
{
    try {
        const id = req.params.id;
        const {city, state, lat, lon} = req.body;
        const updatedLocation = await updateLocationByID(id, city, state, lat, lon);
        if (updatedLocation.affectedRows === 0)
            return res.status(404).json({ success: false, message: "Location not found."});
        res.status(200).json({ success: true, message: "Location updated successfully!"});
    } catch (error){
        res.status(500).json({ success: false, message: "Failed to update location."});
    }
};

export async function getAllLocations (req,res) {
    try {
        const locations = await getLocations();
        res.status(200).json({ success: true, data: locations});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch locations" });
    }
};

export async function getLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const locationByID = await getLocationByID(id);
        if (!locationByID )
            return res.status(404).json({ success: false, message: "Location not found" });
        res.status(200).json({success: true, data: locationByID});
    } catch (error) {
        res.status(500).json({ success: false, message: "Failed to fetch location." });
    }
};

export async function getLatestLocation (req, res)
{
    try {
        const user_id = req.params.id;
        const location = await getLatestLocationByUserID(user_id);
        if (!location)
            return res.status(404).json({ success: false, message: "Location not found" });
        res.status(200).json({ success: true, data: location });
    } catch(error) {
        res.status(500).json({ success: false, message: "Failed to fetch latest location." });
    }
}

export async function deleteLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const result = await deleteLocationByID(id);
        if ( result.affectedRows===0 )
            return res.status(404).json({ success: false, message: "Location not found."});
        res.status(200).json({ success: true, message: "Location deleted successfully!"});
    } catch(error) {
        res.status(500).json({ success: false, message: "Failed to delete location." })
    }
};

