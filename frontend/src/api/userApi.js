import api from "./axiosConfig";

export const getProfile = async () => {
  const res = await api.get("/users/profile");
  return res.data;
};

export const updateProfile = async (data) => {
  const res = await api.put("/users/profile", data);
  return res.data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await api.put("/users/change-password", {
    currentPassword,
    newPassword,
  });
  return res.data;
};
