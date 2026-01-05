/**
 * 🔄 Reset Password API
 * 
 * 비밀번호 재설정 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 비밀번호 재설정
 * POST /auth/reset-password
 * @param {string} memberId - 회원 아이디
 * @param {string} newPassword - 새 비밀번호 (평문, 백엔드에서 암호화)
 * @returns {Promise} API 응답 (Promise)
 */
const resetPwdApi = async (memberId, newPassword) => {
  try {
    const response = await baseApi.post('/auth/reset-password', { memberId, memberPwd: newPassword });
    return response.data;
  } catch (error) {
    console.log('비밀번호 재설정 ajax 통신 실패', error);
    return { success: false, message: '비밀번호 변경 중 오류 발생', data: null };
  }
};

export default resetPwdApi;