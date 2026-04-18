import express from "express";
const router = express.Router();

import {fetchAQI, getAqiHistory, getLatestAqi, getAqiByCity} from "../controllers/aqiController.js";

router.get("/city", getAqiByCity);
router.get("/fetch/:location_id", fetchAQI);
router.get("/history/:location_id", getAqiHistory);
router.get("/latest/:location_id", getLatestAqi);

export default router;