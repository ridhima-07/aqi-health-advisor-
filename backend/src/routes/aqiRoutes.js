import express from "express";
const router = express.Router();

import {fetchAQI, getAqiHistory, getLatestAqi} from "../controllers/aqiController.js";

router.get("/fetch/:location_id", fetchAQI);
router.get("/history/:location_id", getAqiHistory);
router.get("/latest/:location_id", getLatestAqi);

export default router;