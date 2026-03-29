import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import locationRoutes from "./routes/locationRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import aqiRoutes from "./routes/aqiRoutes.js";

app.use(express.json());

app.use("/health-profile", healthRoutes);
app.use("/location", locationRoutes);
app.use("/aqi", aqiRoutes);

app.listen(8000, ()=>{
    console.log("Server is running.")
});