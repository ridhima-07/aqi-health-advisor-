import {getLocationByID} from "../queries/locations.js";
import { getApi } from "../utils/aqiUtils.js";
import { addAqiReading } from "../queries/aqi.js";

export async function fetchAqi ( location_id )
{
    const location = await getLocationByID(location_id);
    if (!location) return null;
    const aqi = await getApi(location.lat, location.lon);
    if (!aqi) return null;
    const aqi_level = aqi.list[0].main.aqi;
    const pollutants = aqi.list[0].components;
    
    const pm25 = pollutants.pm2_5;
    const pm10 = pollutants.pm10;
    const co = pollutants.co;
    const no2 = pollutants.no2;
    const o3 = pollutants.o3;
    const so2 = pollutants.so2;
    const nh3 = pollutants.nh3;
    
    await addAqiReading(location_id, aqi_level, co, no2, o3, so2, pm25, pm10, nh3);
    
    return { aqi_level, pollutants };
}