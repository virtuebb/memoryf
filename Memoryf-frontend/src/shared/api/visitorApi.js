// src/shared/api/visitorApi.js
import axios from "axios";

const API_BASE = "http://localhost:8006/memoryf";

// 🔐 인증용 axios 인스턴스
const authAxios = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // JWT 필터 + CORS 대비
});

// ✅ 모든 요청에 accessToken 자동 주입
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// =========================
// 방문 기록 생성 (POST)
// =========================
export const visitHome = (homeNo) => {
  return authAxios.post(
    "/visitor",
    null,
    {
      params: { homeNo },
    }
  );
};

// =========================
// 방문자 통계 조회 (GET)
// =========================
export const getVisitorStats = (homeNo) => {
  return authAxios.get(
    "/visitor/count",
    {
      params: { homeNo },
    }
  );
};
