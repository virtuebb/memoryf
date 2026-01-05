/**
 * 📊 Activity API
 * 
 * 활동 내역 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';
import { getMemberNoFromToken } from '../../../shared/lib';

/**
 * 좋아요한 피드 목록 조회
 */
export const getLikedFeeds = async (params) => {
  const response = await baseApi.get('/feeds/liked', { params });
	return getApiResponseData(response.data, []);
};

/**
 * 댓글 단 피드 목록 조회
 */
export const getCommentedFeeds = async (params) => {
  const response = await baseApi.get('/feeds/commented', { params });
	return getApiResponseData(response.data, []);
};

/**
 * 좋아요 토글
 */
export const toggleLike = async (feedNo, memberNo) => {
  const response = await baseApi.post(`/feeds/${feedNo}/likes`, { memberNo });
	return getApiResponseData(response.data);
};

/**
 * 계정 내역 조회
 * GET /members/{memberNo}/history
 */
export const getAccountHistory = async (params) => {
  const tokenMemberNo = getMemberNoFromToken();
  const memberNo = params?.memberNo || tokenMemberNo || localStorage.getItem('memberNo');
  
  if (!memberNo) {
    return { list: [] };
  }

  const query = { ...params };
  const response = await baseApi.get(`/members/${memberNo}/history`, { params: query });
	return getApiResponseData(response.data, { list: [] });
};
