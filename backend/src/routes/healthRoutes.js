import express from "express";
const router = express.Router();

import {
    createHealthProfile, 
    updateHealthProfile, 
    getAllHealthProfiles, 
    getHealthProfileByUserIDController, 
    deleteHealthProfile
} from "../controllers/healthController.js";

router.post("/", createHealthProfile);
router.put("/", updateHealthProfile);
router.get("/", getAllHealthProfiles);
router.get("/:id", getHealthProfileByUserIDController);
router.delete("/:id", deleteHealthProfile);

export default router;



