/**
 * ✅ Check Nickname API
 * 
 * 닉네임 중복확인 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 닉네임 중복 확인
 * POST /auth/check-nick
 * @param {string} memberNick - 확인할 닉네임
 * @returns {Promise<boolean|null>} 사용 가능 여부
 */
const checkNickApi = async (memberNick) => {
  try {
    const response = await baseApi.post(
      '/auth/check-nick',
      memberNick,
      { headers: { 'Content-Type': 'text/plain' } }
    );
		return getApiResponseData(response.data);
  } catch (error) {
    console.log('닉네임 중복확인 실패', error);
    return null;
  }
};

export default checkNickApi;