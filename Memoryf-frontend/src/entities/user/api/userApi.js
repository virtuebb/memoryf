/**
 * 회원 조회 API (읽기 전용)
 * 
 * 회원 프로필, 정보 조회 등 조회 기능만 담당
 * 회원 수정/생성/삭제는 features에서 담당
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 회원 상세 정보 조회
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 회원 정보
 */
export const fetchUser = async (memberNo) => {
  const response = await baseApi.get(`/members/${memberNo}`);
  return response.data;
};

/**
 * 회원 프로필 조회
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 프로필 정보
 */
export const fetchUserProfile = async (memberNo) => {
  const response = await baseApi.get(`/members/${memberNo}/profile`);
  return response.data;
};

/**
 * 회원 목록 조회 (페이징)
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise} 페이징된 회원 목록
 */
export const fetchUserList = async (page = 0, size = 20) => {
  const response = await baseApi.get('/members', { params: { page, size } });
  return response.data;
};

/**
 * 회원 검색
 * @param {string} keyword - 검색 키워드
 * @param {number} page - 페이지 번호
 * @param {number} size - 페이지 크기
 * @returns {Promise} 검색 결과
 */
export const searchUsers = async (keyword, page = 0, size = 20) => {
  const response = await baseApi.get('/members/search', { 
    params: { q: keyword, page, size } 
  });
  return response.data;
};

/**
 * 회원 검색 (닉네임) - 기존 search feature의 user 검색 API를 entity로 내림
 * GET /search/members?keyword=xxx
 */
export const searchMembers = async (keyword) => {
  try {
    const response = await baseApi.get('/search/members', {
      params: { keyword },
    });
    return getApiResponseData(response.data, []);
  } catch (error) {
    console.error('회원 검색 실패:', error);
    return [];
  }
};

/**
 * 팔로잉 목록 조회 (read-only)
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

/**
 * 팔로워 목록 조회 (read-only)
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

export default {
  fetchUser,
  fetchUserProfile,
  fetchUserList,
  searchUsers,
  searchMembers,
  getFollowingList,
  getFollowersList,
};
