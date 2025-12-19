import axios from "axios";

const diaryApi = axios.create({
  baseURL: "http://localhost:8006/memoryf/diaries",
  timeout: 10000,
});

// ✅ JWT 자동 첨부
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
 * GET /memoryf/diaries?page=1&size=5
 */
export const getDiaryList = async (page = 1, size = 5) => {
  const res = await diaryApi.get("", {
    params: { page, size },
  });
  return res.data;
};

/**
 * ✏️ 다이어리 작성
 * POST /memoryf/diaries
 */
export const createDiary = async (diary) => {
  const res = await diaryApi.post("", diary);
  return res.data;
};

/**
 * 🗑 다이어리 삭제
 * DELETE /memoryf/diaries/{diaryNo}
 */
export const deleteDiary = async (diaryNo) => {
  const res = await diaryApi.delete(`/${diaryNo}`);
  return res.data;
};

export default diaryApi;
