/**
 * 👥 Follow API
 * 
 * 팔로우 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 팔로우 요청
 * POST /follows/{targetMemberNo}
 */
export const followMember = async (targetMemberNo, memberNo) => {
  const response = await baseApi.post(`/follows/${targetMemberNo}`, { memberNo });

	// 표준: ApiResponse 봉투를 그대로 반환
	return response.data;
};

/**
 * 언팔로우
 * DELETE /follows/{targetMemberNo}
 */
export const unfollowMember = async (targetMemberNo, memberNo) => {
  const response = await baseApi.delete(`/follows/${targetMemberNo}`, { data: { memberNo } });
	return response.data;
};

/**
 * 팔로워 목록 조회
 * GET /follows/followers/{memberNo}
 */
export const getFollowersList = async (
  memberNo,
  currentMemberNo = null,
  { page = 0, size = 20, keyword = '' } = {}
) => {
  const params = { page, size };
  if (currentMemberNo) params.currentMemberNo = currentMemberNo;
  if (keyword) params.keyword = keyword;

  const response = await baseApi.get(`/follows/followers/${memberNo}`, { params });
	return response.data;
};

/**
 * 팔로잉 목록 조회
 * GET /follows/following/{memberNo}
 */
export const getFollowingList = async (
  memberNo,
  currentMemberNo = null,
  { page = 0, size = 20, keyword = '' } = {}
) => {
  const params = { page, size };
  if (currentMemberNo) params.currentMemberNo = currentMemberNo;
  if (keyword) params.keyword = keyword;

  const response = await baseApi.get(`/follows/following/${memberNo}`, { params });
	return response.data;
};
