import api from "./api";

export const createUser = async (payload) => {
  const res = await api.post("/users", payload);
  return res.data;
};