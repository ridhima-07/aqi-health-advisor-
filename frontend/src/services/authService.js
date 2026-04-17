import api from "./api";

export async function signup(payload) {
  const res = await api.post("/auth/signup", payload);
  return res.data;
}

export async function login(payload) {
  const res = await api.post("/auth/login", payload);
  return res.data;
}