/**
 * 📖 Story API
 * 
 * 스토리 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, uploadApi } from '../../../shared/api';

const storyApi = {
  /**
   * 스토리 목록 조회 (홈피 스토리바용)
   * GET /stories/members/{memberNo}
   */
  selectStoryList: async (memberNo) => {
    const res = await baseApi.get(`/stories/members/${memberNo}`);
		return res.data;
  },
  
  /**
   * 특정 회원의 스토리 목록 조회
   * GET /stories/members/{memberNo}/all
   */
  selectStoryListByMember: async (memberNo) => {
    const res = await baseApi.get(`/stories/members/${memberNo}/all`);
		return res.data;
  },
  
  /**
   * 스토리 상세 조회
   * GET /stories/{storyNo}
   */
  selectStoryDetail: async (storyNo) => {
    const res = await baseApi.get(`/stories/${storyNo}`);
		return res.data;
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
