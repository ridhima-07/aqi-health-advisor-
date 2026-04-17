import api from "./api";

export async function getDashboardData(userId) {
  const response = await api.get(`/dashboard/${userId}`);
  return response.data;
}

export async function fetchLatestAqi(locationId) {
  const response = await api.get(`/aqi/fetch/${locationId}`);
  return response.data;
}