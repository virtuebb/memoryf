// src/shared/api/visitorApi.js
import axios from "axios";

const API_BASE = "http://localhost:8006/memoryf";

export const recordVisit = (memberNo, homeNo) => {
  return axios.post(`${API_BASE}/visitor`, null, {
    params: { memberNo, homeNo },
  });
};

export const getVisitorStats = (homeNo) => {
  return axios.get(`${API_BASE}/visitor/count`, {
    params: { homeNo },
  });
};
