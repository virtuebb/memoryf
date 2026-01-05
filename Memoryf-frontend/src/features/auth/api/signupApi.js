/**
 * 📝 Signup API
 * 
 * 회원가입 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 회원가입
 * POST /auth/signup
 * @param {Object} signupData - 회원가입 정보
 * @returns {Promise<any>} 가입 결과
 */
const signupApi = async (signupData) => {
  try {
    const response = await baseApi.post('/auth/signup', signupData);
		return getApiResponseData(response.data);
  } catch (error) {
    console.log('회원가입 ajax 통신 실패', error);
    return null;
  }
};

export default signupApi;