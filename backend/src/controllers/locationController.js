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
        const newLocation = await addLocation( user_id, city, state, lat, lon );
        res.status(200).json({message: "Location Added!"})
    } catch ( error ) {
        console.log(error);
        res.status(500).json({ message: "Failed to add location" });
    }
};

export async function updateLocation (req, res)
{
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
};

export async function getAllLocations (req,res) {
    try {
        const locations = await getLocations();
        res.status(200).json({locations});
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch locations" });
    }
};

export async function getLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const locationByID = await getLocationByID(id);
        if (!locationByID )
            return res.status(404).json({ message: "Location not found" });
        res.status(200).json({locationByID});
    } catch (error) {
        res.status(404).json({ message: "Location not found" });
    }
};

export async function getLatestLocation (req, res)
{
    try {
        const user_id = req.params.id;
        const location = await getLatestLocationByUserID(user_id);
        if (!location)
            return res.status(404).json({ message: "Location not found" });
        return res.status(200).json({ location });
    } catch(error) {
        res.status(404).json({ message: "Location not found" });
    }
}

export async function deleteLocationByIDController (req, res) {
    try {
        const id = req.params.id;
        const result = await deleteLocationByID(id);
        if ( result.affectedRows===0 )
            return res.status(400).json({message: "Location not found."});
        return res.status(200).json({message: "Location deleted successfully!"});
    } catch(error) {
        res.status(500).json({message: "Failed to delete location." })
    }
};

