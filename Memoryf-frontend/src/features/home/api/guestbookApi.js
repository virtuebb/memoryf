import axios from "axios";

const API_BASE_URL = "http://localhost:8006/memoryf";

const guestbookApi = axios.create({
  baseURL: `${API_BASE_URL}/guestbook`,
  withCredentials: true,
});

// JWT 자동 첨부
guestbookApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 방명록 목록
export const getGuestbookList = async (homeNo) => {
  const res = await guestbookApi.get("", {
    params: { homeNo },
  });
  return res.data;
};

// 방명록 작성 ⭐⭐⭐
export const createGuestbook = async ({
  homeNo,
  guestbookContent,
  memberNo,
}) => {
  return guestbookApi.post("", {
    homeNo,
    guestbookContent,
    memberNo,
  });
};
