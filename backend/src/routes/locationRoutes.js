import express from "express";
const router = express.Router();

import {
    addNewLocation, 
    updateLocation, 
    getAllLocations, 
    getLocationByIDController, 
    deleteLocationByIDController
} from "../controllers/locationController.js";

router.post("/", addNewLocation);
router.put("/:id", updateLocation);
router.get("/", getAllLocations);
router.get("/:id", getLocationByIDController);
router.delete("/:id", deleteLocationByIDController);

export default router;
