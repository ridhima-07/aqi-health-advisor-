export async function geocodeCity(cityName) {
  try {
    if (!cityName || !cityName.trim()) {
      throw new Error("City name is required");
    }

    const response = await fetch(
      `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName.trim())}&limit=1&appid=${process.env.OP_API_KEY}`
    );

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data.length) {
      throw new Error("Location not found");
    }

    const location = data[0];

    return {
      name: location.name,
      lat: location.lat,
      lon: location.lon,
      country: location.country,
      state: location.state || "",
    };
  } catch (error) {
    throw error;
  }
}