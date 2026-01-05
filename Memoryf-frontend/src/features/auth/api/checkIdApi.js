/**
 * ✅ Check ID API
 * 
 * 아이디 중복확인 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 아이디 중복 확인
 * POST /auth/check-id
 * @param {string} memberId - 확인할 회원 아이디
 * @returns {Promise<boolean|null>} 사용 가능 여부
 */
const checkIdApi = async (memberId) => {
  try {
    const response = await baseApi.post(
      '/auth/check-id',
      memberId,
      { headers: { 'Content-Type': 'text/plain' } }
    );
		return getApiResponseData(response.data);
  } catch (error) {
    console.log('아이디 중복확인 실패', error);
    return null;
  }
};

export default checkIdApi;