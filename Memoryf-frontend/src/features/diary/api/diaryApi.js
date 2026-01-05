/**
 * 📓 Diary API
 * 
 * 다이어리 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData, isApiResponse } from '../../../shared/api';

const unwrapOrThrow = (response) => {
  const payload = response?.data;

  if (isApiResponse(payload)) {
    if (payload.success === false) {
      throw new Error(payload.message || '요청 실패');
    }
    return getApiResponseData(payload);
  }

  return payload;
};

/**
 * 📓 다이어리 목록 조회 (페이징)
 * GET /diaries?page=1&size=5
 */
export const getDiaryList = async (page = 1, size = 5) => {
  try {
    const res = await baseApi.get("/diaries", {
      params: { page, size },
    });
    return unwrapOrThrow(res);
  } catch (err) {
    console.error("❌ getDiaryList 실패", err);
    throw err;
  }
};

/**
 * ✏️ 다이어리 작성
 * POST /diaries
 */
export const createDiary = async (content) => {
  try {
    const res = await baseApi.post("/diaries", { content });
    return unwrapOrThrow(res);
  } catch (err) {
    console.error("❌ createDiary 실패", err);
    throw err;
  }
};

/**
 * ✏️ 다이어리 수정
 * PUT /diaries/{diaryNo}
 */
export const updateDiary = async (diaryNo, content) => {
  try {
    const res = await baseApi.put(`/diaries/${diaryNo}`, { content });
    return unwrapOrThrow(res);
  } catch (err) {
    console.error("❌ updateDiary 실패", err);
    throw err;
  }
};

/**
 * 🗑 다이어리 삭제
 * DELETE /diaries/{diaryNo}
 */
export const deleteDiary = async (diaryNo) => {
  try {
    const res = await baseApi.delete(`/diaries/${diaryNo}`);
    return unwrapOrThrow(res);
  } catch (err) {
    console.error("❌ deleteDiary 실패", err);
    throw err;
  }
};

// 기존 호환성을 위한 default export
export default baseApi;
