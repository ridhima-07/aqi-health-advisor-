import {getLocationByID} from "../queries/locations.js";
import { getApi, getAqiLabel, getAqiBandLabel } from "../utils/aqiUtils.js";
import { geocodeCity } from "./geoCodingServices.js";
import { addAqiReading, getLatestAqiReadingByLocationID } from "../queries/aqi.js";
import { calcAQINumber } from "../utils/aqiNumberUtils.js";

export async function getLatestAqi(location_id) {
  const latest = await getLatestAqiReadingByLocationID(location_id);

  if (!latest) {
    return null;
  }

  const pollutants = {
    co: latest.co,
    no2: latest.no2,
    o3: latest.o3,
    so2: latest.so2,
    pm2_5: latest.pm2_5,
    pm10: latest.pm10,
    nh3: latest.nh3,
  };

  const aqiCalc = calcAQINumber(pollutants);

  return {
    id: latest.id,
    aqi_level: latest.aqi_level,
    aqiValue: aqiCalc.aqiValue,
    dominantPollutant: aqiCalc.dominantPollutant,
    pollutants,
    fetchedAt: latest.created_at,
  };
}

export async function fetchAndStoreLatestAqi ( location_id )
{
    const location = await getLocationByID(location_id);
    if (!location) return null;
    const aqi = await getApi(location.lat, location.lon);
    if (!aqi) return null;
    const aqi_level = aqi.list[0].main.aqi;
    const pollutants = aqi.list[0].components;

    const aqiCalc = calcAQINumber(pollutants);
    const aqiLabel = getAqiLabel( aqi_level );
    
    const pm25 = pollutants.pm2_5;
    const pm10 = pollutants.pm10;
    const co = pollutants.co;
    const no2 = pollutants.no2;
    const o3 = pollutants.o3;
    const so2 = pollutants.so2;
    const nh3 = pollutants.nh3;

    await addAqiReading(location_id, aqi_level, co, no2, o3, so2, pm25, pm10, nh3);
    
    return { 
        aqi_level, 
        aqiValue: aqiCalc.aqiValue, 
        aqiLabel: aqiLabel,
        dominantPollutant: aqiCalc.dominantPollutant, 
        pollutants, 
        fetchedAt: new Date().toISOString()
    };
}

export async function fetchAqiByCity(cityName) {
  try {
    const location = await geocodeCity(cityName);
    const { lat, lon, name, state, country } = location;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.OP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`AQI fetch failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.list || !data.list.length) {
      throw new Error("AQI data not found");
    }

    const aqiRaw = data.list[0];
    const pollutants = aqiRaw.components;

    const normalizedPollutants = {
      pm2_5: pollutants.pm2_5,
      pm10: pollutants.pm10,
      no2: pollutants.no2,
      o3: pollutants.o3,
      co: pollutants.co,
      so2: pollutants.so2,
    };

    const aqiCalc = calcAQINumber(normalizedPollutants);

    return {
      location: {
        name,
        state,
        country,
        lat,
        lon,
      },
      aqi_level: aqiRaw.main.aqi,
      aqiValue: aqiCalc.aqiValue,
      dominantPollutant: aqiCalc.dominantPollutant,
      aqiLabel: getAqiBandLabel(aqiCalc.aqiValue),
      pollutants: normalizedPollutants,
      fetchedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.log("fetchAqiByCity error:", error.message);
    throw error;
  }
}