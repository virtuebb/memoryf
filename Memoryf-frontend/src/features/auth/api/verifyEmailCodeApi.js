/**
 * ✅ Verify Email Code API
 * 
 * 이메일 인증 코드 확인 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 이메일 인증 코드 확인
 * POST /auth/verify-code
 * @param {string} email - 이메일 주소
 * @param {string} code - 인증 코드
 * @returns {Promise<number>} 결과 코드 (0: 실패)
 */
const verifyEmailCodeApi = async (email, code) => {
  try {
    const response = await baseApi.post('/auth/verify-code', { email, code });
		return getApiResponseData(response.data, 0);
  } catch (error) {
    console.log(error);
    return 0;
  }
};

export default verifyEmailCodeApi;