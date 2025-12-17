import axios from "axios";

// 🌐 동적 baseURL 설정
// - localhost 접속 시: http://localhost:8006/memoryf
// - 네트워크 IP 접속 시: http://192.168.x.x:8006/memoryf
const getBaseURL = () => {
  const hostname = window.location.hostname;
  return `http://${hostname}:8006/memoryf`;
};

const api = axios.create({
  baseURL: getBaseURL(),
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
