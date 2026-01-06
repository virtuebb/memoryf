/**
 * 📖 Story API
 * 
 * 스토리 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, uploadApi, getApiResponseData } from '../../../shared/api';

/**
 * 스토리 데이터 정규화 (백엔드 필드명 → 프론트엔드 필드명)
 */
const normalizeStory = (story) => {
	if (!story || typeof story !== "object") return story;
	
	return {
		...story,
		// 날짜 필드: createdAt → createDate
		createDate: story.createdAt || story.createDate,
		createdAt: story.createdAt || story.createDate,
		expireDate: story.expiredAt || story.expireDate,
		expiredAt: story.expiredAt || story.expireDate,
		// 삭제 여부: isDeleted → isDel
		isDel: story.isDeleted || story.isDel,
		isDeleted: story.isDeleted || story.isDel,
		// 프로필 이미지: profileSavedName → profileChangeName
		profileChangeName: story.profileImg || story.profileSavedName || story.profileChangeName,
		profileSavedName: story.profileImg || story.profileSavedName || story.profileChangeName,
		profileImg: story.profileImg || story.profileSavedName || story.profileChangeName,
	};
};

/**
 * 스토리 상세 데이터 정규화
 */
const normalizeStoryDetail = (detail) => {
	if (!detail || typeof detail !== "object") return detail;
	
	const normalized = {
		...detail,
	};
	
	// story 객체 정규화
	if (detail.story) {
		normalized.story = normalizeStory(detail.story);
	}
	
	// items 배열 정규화
	if (Array.isArray(detail.items)) {
		normalized.items = detail.items.map((item) => ({
			...item,
			// savedName → changeName (호환성)
			changeName: item.savedName || item.changeName,
			savedName: item.savedName || item.changeName,
			createDate: item.createdAt || item.createDate,
			createdAt: item.createdAt || item.createDate,
			isDel: item.isDeleted || item.isDel,
			isDeleted: item.isDeleted || item.isDel,
		}));
	}
	
	return normalized;
};

const storyApi = {
  /**
   * 스토리 목록 조회 (홈피 스토리바용)
   * GET /stories/members/{memberNo}
   */
  selectStoryList: async (memberNo) => {
    const res = await baseApi.get(`/stories/members/${memberNo}`);
		const data = getApiResponseData(res.data, []);
		const stories = Array.isArray(data) ? data : [];
		return { ...res.data, data: stories.map(normalizeStory) };
  },
  
  /**
   * 특정 회원의 스토리 목록 조회
   * GET /stories/members/{memberNo}/all
   */
  selectStoryListByMember: async (memberNo) => {
    const res = await baseApi.get(`/stories/members/${memberNo}/all`);
		const data = getApiResponseData(res.data, []);
		const stories = Array.isArray(data) ? data : [];
		return { ...res.data, data: stories.map(normalizeStory) };
  },
  
  /**
   * 스토리 상세 조회
   * GET /stories/{storyNo}
   */
  selectStoryDetail: async (storyNo) => {
    const res = await baseApi.get(`/stories/${storyNo}`);
		const data = getApiResponseData(res.data, null);
		return { ...res.data, data: data ? normalizeStoryDetail(data) : null };
  },
  
  /**
   * 스토리 방문 기록
   * POST /stories/{storyNo}/visits
   */
  insertStoryVisitor: async (memberNo, storyNo) => {
    const res = await baseApi.post(`/stories/${storyNo}/visits`, { memberNo, storyNo });
		return res.data;
  },

  /**
   * 스토리 업로드 (multipart)
   * POST /stories
   */
  insertStory: async (formData) => {
    const res = await uploadApi.post("/stories", formData);
		return res.data;
  },

  /**
   * 스토리 삭제
   * DELETE /stories/{storyNo}
   */
  deleteStory: async (storyNo) => {
    const res = await baseApi.delete(`/stories/${storyNo}`);
		return res.data;
  },
};

export default storyApi;
