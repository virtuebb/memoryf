/**
 * 피드 조회 API (읽기 전용)
 *
 * 피드 조회/상세 조회/댓글 조회 등 "read" 성격의 호출만 담당합니다.
 * 피드 생성/수정/삭제 및 좋아요/북마크 토글 등 "write" 성격은 features에서 담당합니다.
 */
import { baseApi, getApiResponseData } from '../../../shared/api';
import { getMemberNoFromToken } from '../../../shared/lib';

const feedApi = baseApi;

/**
 * 피드 목록 조회 (RESTful: GET /feeds)
 * @param {string} sortBy - 정렬 기준 ('popular' | 'following' | 'recent')
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Array>} 피드 목록
 */
export const getFeedList = async (sortBy = 'recent', page = 0, size = 18) => {
  const memberNo = getMemberNoFromToken();
  const params = { sortBy, page, size };
  if (memberNo) params.memberNo = memberNo;

  const response = await feedApi.get('/feeds', {
    params,
    timeout: 10000,
  });

	const data = getApiResponseData(response.data, []);
	return Array.isArray(data) ? data : (Array.isArray(response.data) ? response.data : []);
};

/**
 * 특정 회원(작성자)의 피드 목록 조회 (RESTful: GET /feeds/by-member/{targetMemberNo})
 * @param {number} targetMemberNo
 * @param {number|null} viewerMemberNo
 * @param {number} page
 * @param {number} size
 * @returns {Promise<Array>} 피드 목록
 */
export const getFeedListByMember = async (
  targetMemberNo,
  viewerMemberNo = null,
  page = 0,
  size = 60
) => {
  const params = { page, size };
  if (viewerMemberNo) params.viewerMemberNo = viewerMemberNo;

  const response = await feedApi.get(`/feeds/by-member/${targetMemberNo}`, { params });

	const data = getApiResponseData(response.data, []);
	return Array.isArray(data) ? data : [];
};

/**
 * 피드 상세 조회 (RESTful: GET /feeds/:id)
 * @param {number} feedNo
 * @returns {Promise<any>} 피드 상세 데이터
 */
export const getFeedDetail = async (feedNo) => {
  const memberNo = getMemberNoFromToken();
  const params = {};
  if (memberNo) params.memberNo = memberNo;

  const response = await feedApi.get(`/feeds/${feedNo}`, { params });

	return getApiResponseData(response.data, response.data);
};

/**
 * 특정 피드의 댓글 목록 조회 (RESTful: GET /feeds/:id/comments)
 * @param {number} feedNo
 * @returns {Promise<Array>} 댓글 목록
 */
export const getComments = async (feedNo) => {
  const memberNo = getMemberNoFromToken();
  const params = {};
  if (memberNo) params.memberNo = memberNo;

  const response = await feedApi.get(`/feeds/${feedNo}/comments`, { params });

	const data = getApiResponseData(response.data, []);
	return Array.isArray(data) ? data : [];
};

/**
 * 북마크한 피드 목록 조회 (RESTful: GET /feeds/bookmarked)
 * @param {number} memberNo
 * @returns {Promise<Array>} 북마크 피드 목록
 */
export const getBookmarkedFeedList = async (memberNo) => {
  const response = await feedApi.get('/feeds/bookmarked', {
    params: { memberNo },
  });

	const data = getApiResponseData(response.data, []);
	return Array.isArray(data) ? data : [];
};

export default {
  getFeedList,
  getFeedListByMember,
  getFeedDetail,
  getComments,
  getBookmarkedFeedList,
};
