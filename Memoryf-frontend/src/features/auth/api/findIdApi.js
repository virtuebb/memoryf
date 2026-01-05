/**
 * 🔍 Find ID API
 * 
 * 아이디 찾기 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 아이디 찾기
 * POST /auth/find-id
 * @param {string} memberName - 회원 이름
 * @param {string} email - 이메일 주소
 * @returns {Promise} API 응답 (Promise)
 */
const findIdApi = async (memberName, email) => {
  try {
    const response = await baseApi.post('/auth/find-id', { memberName, email });
    return response.data;
  } catch (error) {
    console.log('아이디 찾기 ajax 통신 실패', error);
    return { success: false, message: '아이디 찾기 실패', data: null };
  }
};

export default findIdApi;