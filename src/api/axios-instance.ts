import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

export const axiosPrivateInstance = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true,
});
