import api from "./api";

export async function getAqiByCity(cityName) {
  const res = await api.get(`/aqi/city?name=${encodeURIComponent(cityName)}`);
  return res.data;
}