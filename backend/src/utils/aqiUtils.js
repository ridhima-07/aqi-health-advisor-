import dotenv from "dotenv";
dotenv.config();

export function  getAqiBandLabel(aqiValue) {
  if (aqiValue <= 50) return "Good";
  if (aqiValue <= 100) return "Fair";
  if (aqiValue <= 150) return "Moderate";
  if (aqiValue <= 200) return "Poor";
  if (aqiValue <= 300) return "Very Poor";
  return "Hazardous";
}

export function calculateRiskLevel(aqiValue, healthProfile) {
  let score = 0;

  if (aqiValue <= 50) score += 0;
  else if (aqiValue <= 100) score += 1;
  else if (aqiValue <= 150) score += 2;
  else if (aqiValue <= 200) score += 3;
  else if (aqiValue <= 300) score += 4;
  else score += 5;

  if (healthProfile.isSmoker) score += 1;
  if (healthProfile.hasAllergy) score += 1;
  if (healthProfile.hasHeartCondition) score += 2;
  if (healthProfile.hasAsthma) score += 2;
  if (healthProfile.hasCOPD) score += 3;

  if (score <= 2) return "LOW";
  if (score <= 5) return "MODERATE";
  if (score <= 8) return "HIGH";
  return "SEVERE";
}

export async function getApi (lat, lon) {
    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OP_API_KEY}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
    }
};