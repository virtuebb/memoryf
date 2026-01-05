/**
 * 🔍 Search API
 * 
 * 검색 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

export { searchMembers } from '../../../entities/user';

/**
 * 태그 검색 (피드)
 * GET /search/feeds?tag=xxx
 * @param {string} keyword 
 */
export const searchFeedsByTag = async (keyword) => {
  try {
    const response = await baseApi.get('/search/feeds', {
      params: { tag: keyword }
    });
    return getApiResponseData(response.data, []);
  } catch (error) {
    console.error('태그 검색 실패:', error);
    return [];
  }
};

// 기존 호환성을 위한 default export
export default baseApi;
