/**
 * 🔒 Security API
 * 
 * 보안 설정 관련 API 호출 모듈
 * shared/api의 baseApi를 사용하여 일관된 설정 유지
 * 
 * 응답 형식 (ApiResponse):
 * { success: boolean, message: string, data: T, timestamp: string }
 */
import { baseApi, getApiResponseData } from '../../../shared/api';

/**
 * 비밀번호 변경
 * PUT /members/{memberNo}/password
 */
export const updatePassword = async (memberNo, data) => {
  const response = await baseApi.put(`/members/${memberNo}/password`, data);
	return getApiResponseData(response.data);
};

/**
 * 회원 탈퇴
 * DELETE /members/{memberNo}
 */
export const deleteAccount = async (memberNo, data) => {
  const response = await baseApi.delete(`/members/${memberNo}`, { data });
	return getApiResponseData(response.data);
};

/**
 * 이메일 변경
 * PUT /members/{memberNo}/email
 */
export const updateEmail = async (memberNo, data) => {
  const response = await baseApi.put(`/members/${memberNo}/email`, data);
	return getApiResponseData(response.data);
};

/**
 * 전화번호 변경
 * PUT /members/{memberNo}/phone
 */
export const updatePhone = async (memberNo, data) => {
  const response = await baseApi.put(`/members/${memberNo}/phone`, data);
	return getApiResponseData(response.data);
};

/**
 * 인증 코드 발송
 * POST /auth/send-code
 */
export const sendVerificationCode = async (email) => {
  const response = await baseApi.post('/auth/send-code', { email });
	return getApiResponseData(response.data);
};

/**
 * 인증 코드 확인
 * POST /auth/verify-code
 */
export const verifyCode = async (email, code) => {
  const response = await baseApi.post('/auth/verify-code', { email, code });
	return getApiResponseData(response.data);
};
