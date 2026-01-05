/**
 * 🔍 Find Password API
 * 
 * 비밀번호 찾기 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 비밀번호 찾기 (계정 존재 여부 확인)
 * POST /auth/find-password
 * @param {string} memberId - 회원 아이디
 * @param {string} email - 이메일 주소
 * @returns {Promise} API 응답 (Promise)
 */
const findPwdApi = async (memberId, email) => {
  try {
    const response = await baseApi.post('/auth/find-password', { memberId, email });
    return response.data;
  } catch (error) {
    console.log('비밀번호 찾기 ajax 통신 실패', error);
    return { success: false, message: '비밀번호 찾기 실패', data: null };
  }
};

export default findPwdApi;
