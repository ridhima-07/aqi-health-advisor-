import api from "./api";

export const createLocation = async (payload) => {
  const res = await api.post("/location", payload);
  return res.data;
};