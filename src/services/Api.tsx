import axios from 'axios';

const env = import.meta.env;

const api = axios.create({
  baseURL: env.VITE_API_BASE_URL,
  withCredentials: true
});

export default api;