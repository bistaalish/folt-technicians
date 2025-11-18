import API from "./axiosInstance";

export const searchONU = async (query) => {
  const res = await API.get(`/onu/search`, {
    params: { query }
  });
  return res.data;
};