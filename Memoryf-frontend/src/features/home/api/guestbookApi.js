/**
 * 📝 Guestbook API
 * 
 * 방명록 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

const unwrap = (response, defaultValue = null) => {
  return getApiResponseData(response?.data, defaultValue);
};

/**
 * 방명록 목록 조회
 * GET /guestbook/{homeNo}
 */
export const getGuestbookList = async (homeNo, offset = 0, limit = 3) => {
  const res = await baseApi.get(`/guestbook/${homeNo}`, {
    params: { offset, limit },
  });
  return unwrap(res, []);
};

/**
 * 방명록 작성
 * POST /guestbook
 */
export const createGuestbook = async ({
  homeNo,
  guestbookContent,
  memberNo,
}) => {
  const res = await baseApi.post("/guestbook", {
    homeNo,
    guestbookContent,
    memberNo,
  });
  return unwrap(res);
};

// 기존 호환성을 위한 default export
export default baseApi;
