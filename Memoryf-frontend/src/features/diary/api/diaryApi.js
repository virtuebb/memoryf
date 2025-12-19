import axios from "axios";

const diaryApi = axios.create({
  baseURL: "http://localhost:8006/memoryf/diaries",
  timeout: 10000,
});

// ✅ JWT 자동 첨부 (기존 코드 유지)
diaryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  console.log("DIARY TOKEN =", token);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 📓 다이어리 목록 조회 (페이징)
 */
export const getDiaryList = async (page = 1, size = 5) => {
  const res = await diaryApi.get("", {
    params: { page, size },
  });
  return res.data;
};

/**
 * ✏️ 다이어리 작성
 */
export const createDiary = async (diary) => {
  const res = await diaryApi.post("", diary);
  return res.data;
};

/**
 * 🗑 다이어리 삭제
 */
export const deleteDiary = async (diaryNo) => {
  const res = await diaryApi.delete(`/${diaryNo}`);
  return res.data;
};

export default diaryApi;
