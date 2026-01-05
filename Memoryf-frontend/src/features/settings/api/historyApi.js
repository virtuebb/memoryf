/**
 * 📋 History API
 * 
 * 계정 내역 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 계정 내역 조회
 * GET /members/{memberNo}/history
 */
export const getAccountHistory = async (memberNo, params) => {
  const response = await baseApi.get(`/members/${memberNo}/history`, { params });
	return getApiResponseData(response.data, { list: [] });
};
