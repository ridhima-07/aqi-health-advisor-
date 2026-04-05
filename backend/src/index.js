import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import aqiRoutes from "./routes/aqiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recommendationRoutes from "./routes/recommendationsRoutes.js";

app.use(cors());
app.use(express.json());

app.use("/health-profile", healthRoutes);
app.use("/location", locationRoutes);
app.use("/aqi", aqiRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/recommendations", recommendationRoutes);

app.listen(8000, ()=>{
    console.log("Server is running.")
});