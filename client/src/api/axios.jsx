import axios from "axios";
const BASE_UR = import.meta.env.VITE_REACT_API_URL;

export default axios.create({
  baseURL: BASE_UR,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASE_UR,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
