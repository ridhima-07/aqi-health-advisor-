import dotenv from "dotenv";
dotenv.config();

export function getAqiLabel ( aqiLevel )
{
        switch ( aqiLevel )
        {
            case 1: return "Good";
            case 2: return "Fair";
            case 3: return "Moderate";
            case 4: return "Poor";
            case 5: return "Very Poor";
            default: return "Unknown";
        }
};

export function  getAqiBandLabel(aqiValue) {
  if (aqiValue <= 50) return "Good";
  if (aqiValue <= 100) return "Fair";
  if (aqiValue <= 150) return "Moderate";
  if (aqiValue <= 200) return "Poor";
  if (aqiValue <= 300) return "Very Poor";
  return "Hazardous";
}

export function calculateRiskLevel ( aqiLevel, healthProfile )
{
    let score = aqiLevel - 1;
    if ( healthProfile.isSmoker ) score += 1;
    if ( healthProfile.hasAllergy ) score += 1;
    if ( healthProfile.hasHeartCondition ) score += 2;
    if ( healthProfile.hasAsthma ) score += 2;
    if ( healthProfile.hasCOPD ) score += 3;
    
    if ( score>=0 && score<=2 )
        return "LOW";
    else if ( score>=3 && score<=5 )
        return "MODERATE";
    else if ( score>=6 && score<=8 )
        return "HIGH";
    else if ( score>=9 )
        return "SEVERE";
    return "UNKNOWN";
};

export async function getApi (lat, lon) {
    try {
        const response = await fetch(`http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OP_API_KEY}`);
        const data = await response.json();
        return data;
    } catch ( error ) {
        console.log(error);
    }
};