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
	const feeds = Array.isArray(data) ? data : (Array.isArray(response.data) ? response.data : []);
	return feeds.map(normalizeFeed);
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
	const feeds = Array.isArray(data) ? data : [];
	return feeds.map(normalizeFeed);
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

	const data = getApiResponseData(response.data, response.data);
	return normalizeFeed(data);
};

/**
 * 피드 데이터 정규화 (백엔드 필드명 → 프론트엔드 필드명)
 */
const normalizeFeed = (feed) => {
	if (!feed || typeof feed !== "object") return feed;
	
	const normalized = {
		...feed,
		// 날짜 필드: createdAt → createDate
		createDate: feed.createdAt || feed.createDate,
		createdAt: feed.createdAt || feed.createDate,
		// 삭제 여부: isDeleted → isDel
		isDel: feed.isDeleted || feed.isDel,
		isDeleted: feed.isDeleted || feed.isDel,
		// 프로필 이미지: profileSavedName → profileChangeName
		profileChangeName: feed.profileImage || feed.profileSavedName || feed.profileChangeName,
		profileSavedName: feed.profileImage || feed.profileSavedName || feed.profileChangeName,
		profileImage: feed.profileImage || feed.profileSavedName || feed.profileChangeName,
	};
	
	// 피드 파일 배열도 정규화
	if (Array.isArray(normalized.feedFiles)) {
		normalized.feedFiles = normalized.feedFiles.map((file) => ({
			...file,
			createDate: file.createdAt || file.createDate,
			createdAt: file.createdAt || file.createDate,
			isDel: file.isDeleted || file.isDel,
			isDeleted: file.isDeleted || file.isDel,
			changeName: file.savedName || file.changeName,
			savedName: file.savedName || file.changeName,
		}));
	}
	
	return normalized;
};

/**
 * 댓글 데이터 정규화 (백엔드 필드명 → 프론트엔드 필드명)
 */
const normalizeComment = (comment) => {
	if (!comment || typeof comment !== "object") return comment;
	
	return {
		...comment,
		// 백엔드 필드명을 프론트엔드 필드명으로 매핑
		writerNick: comment.memberNick || comment.writerNick,
		writerProfileImage: comment.memberProfileImage || comment.writerProfileImage,
		writerStatus: comment.memberStatus || comment.writerStatus,
		writer: comment.memberNo || comment.writer,
		createDate: comment.createdAt || comment.createDate,
		isDel: comment.isDeleted || comment.isDel,
		// 호환성을 위해 원본 필드도 유지
		memberNick: comment.memberNick || comment.writerNick,
		memberProfileImage: comment.memberProfileImage || comment.writerProfileImage,
		memberStatus: comment.memberStatus || comment.writerStatus,
		memberNo: comment.memberNo || comment.writer,
		createdAt: comment.createdAt || comment.createDate,
		isDeleted: comment.isDeleted || comment.isDel,
	};
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
	const comments = Array.isArray(data) ? data : [];
	
	// 댓글 데이터 정규화
	return comments.map(normalizeComment);
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
	const feeds = Array.isArray(data) ? data : [];
	return feeds.map(normalizeFeed);
};

export default {
  getFeedList,
  getFeedListByMember,
  getFeedDetail,
  getComments,
  getBookmarkedFeedList,
};
