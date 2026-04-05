import api from "./api";

export const createHealthProfile = async (payload) => {
  const res = await api.post("/health-profile", payload);
  return res.data;
};