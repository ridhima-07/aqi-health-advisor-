import dotenv from 'dotenv';
dotenv.config();

import express from "express";
const app = express();

const PORT = process.env.PORT || 8000;

import cors from "cors";
import locationRoutes from "./routes/locationRoutes.js";
import healthRoutes from "./routes/healthRoutes.js";
import aqiRoutes from "./routes/aqiRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import recommendationRoutes from "./routes/recommendationsRoutes.js";
import authRoutes from "./routes/authRoutes.js";

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AQI Health Advisor Backend Running Successfully");
});

app.use("/health-profile", healthRoutes);
app.use("/location", locationRoutes);
app.use("/aqi", aqiRoutes);
app.use("/users", userRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/recommendations", recommendationRoutes);
app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});