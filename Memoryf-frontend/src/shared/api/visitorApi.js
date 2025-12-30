// src/shared/api/visitorApi.js
import axios from "axios";
const API_BASE = "http://localhost:8006/memoryf";

const authAxios = axios.create({ baseURL: API_BASE });

// ✅ 기존 프로젝트처럼 토큰을 헤더에 실어주기
authAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const visitHome = (homeNo) =>
  authAxios.post(`/visitor`, null, { params: { homeNo } });

export const getVisitorStats = (homeNo) =>
  authAxios.get(`/visitor/count`, { params: { homeNo } });
