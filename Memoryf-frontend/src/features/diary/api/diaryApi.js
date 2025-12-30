import axios from "axios";

const diaryApi = axios.create({
  baseURL: "http://localhost:8006/memoryf/diaries",
  timeout: 10000,
});

// ✅ JWT 자동 첨부
diaryApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
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
  try {
    const res = await diaryApi.get("", {
      params: { page, size },
    });
    return res.data;
  } catch (err) {
    console.error("❌ getDiaryList 실패", err);
    throw err;
  }
};

/**
 * ✏️ 다이어리 작성
 * POST /memoryf/diaries
 */
export const createDiary = async (content) => {
  try {
    const res = await diaryApi.post("", { content });
    return res.data;
  } catch (err) {
    console.error("❌ createDiary 실패", err);
    throw err;
  }
};

/**
 * ✏️ 다이어리 수정
 * PUT /memoryf/diaries/{diaryNo}
 */
export const updateDiary = async (diaryNo, content) => {
  try {
    const res = await diaryApi.put(`/${diaryNo}`, { content });
    return res.data;
  } catch (err) {
    console.error("❌ updateDiary 실패", err);
    throw err;
  }
};

/**
 * 🗑 다이어리 삭제
 * DELETE /memoryf/diaries/{diaryNo}
 */
export const deleteDiary = async (diaryNo) => {
  try {
    const res = await diaryApi.delete(`/${diaryNo}`);
    return res.data;
  } catch (err) {
    console.error("❌ deleteDiary 실패", err);
    throw err;
  }
};

export default diaryApi;
