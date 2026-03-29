import express from "express";
const router = express.Router();

import {getDashboardData} from "../controllers/dashboardController.js";

router.get("/:id", getDashboardData);

export default router;