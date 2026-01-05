/**
 * ⚙️ Preference API
 * 
 * 환경설정 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 비공개 설정 업데이트
 */
export const updatePrivacy = async (memberNo, isPrivate) => {
  const response = await baseApi.put(`/home/${memberNo}/privacy`, { isPrivate });
	return response.data;
};

/**
 * 홈 정보 조회
 */
export const getHomeInfo = async (memberNo) => {
  const response = await baseApi.get(`/home/${memberNo}`);
	return response.data;
};
