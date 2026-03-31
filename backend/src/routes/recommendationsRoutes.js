import express from "express";
const router = express.Router();

import { nextBestAction } from "../controllers/recommendationsController.js";

router.get("/:id", nextBestAction);

export default router;