/**
 * 🔐 Login API
 * 
 * 로그인 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 로그인
 * POST /auth/login
 * @param {string} memberId - 회원 아이디
 * @param {string} memberPwd - 회원 비밀번호
 * @returns {Promise<string|null>} JWT 토큰 또는 null
 */
const loginMemberApi = async (memberId, memberPwd) => {
  try {
    const response = await baseApi.post('/auth/login', { memberId, memberPwd });
		return getApiResponseData(response.data); // { token: JWT }
  } catch (error) {
    console.log('로그인 ajax 통신 실패', error);
    return null;
  }
};

export default loginMemberApi;
