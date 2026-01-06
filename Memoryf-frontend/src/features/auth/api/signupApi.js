/**
 * 📝 Signup API
 * 
 * 회원가입 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi } from '../../../shared/api';

/**
 * 회원가입
 * POST /auth/signup
 * @param {Object} signupData - 회원가입 정보
 * @returns {Promise<any>} 가입 결과
 */
const signupApi = async (signupData) => {
  try {
    const response = await baseApi.post('/auth/signup', signupData);

		// ApiResponse.success=true 인데 data=null 일 수 있음 (회원가입은 보통 반환 데이터 없음)
		// SignupForm은 null 여부로 성공을 판단하므로, 성공이면 true를 반환
		return response?.data?.success === true ? true : null;
  } catch (error) {
    console.log('회원가입 ajax 통신 실패', error);
    return null;
  }
};

export default signupApi;