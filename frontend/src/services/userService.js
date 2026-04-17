import api from "./api";

export async function updateUserProfile(userId, payload) {
  const res = await api.put(`/users/${userId}/profile`, payload);
  return res.data;
}