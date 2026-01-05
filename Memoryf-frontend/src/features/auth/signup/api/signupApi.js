/**
 * 회원가입 기능 API
 */
import { signupApi as signup, checkIdApi as checkId, checkNickApi as checkNick } from '../../api';

export const signupApi = {
  /**
   * 회원가입
   * POST /auth/signup
   * @param {object} userData - 회원가입 정보
   * @returns {Promise} 가입 결과
   */
  signup: async (userData) => {
    const data = await signup(userData);
    return { success: data !== null, data, message: data !== null ? '회원가입 성공' : '회원가입 실패' };
  },

  /**
   * 아이디 중복 확인
   * POST /auth/check-id
   * @param {string} memberId - 확인할 아이디
   * @returns {Promise} 중복 확인 결과
   */
  checkId: async (memberId) => {
    const data = await checkId(memberId);
    return { success: data !== null, data, message: data?.available ? '사용 가능한 아이디입니다.' : '이미 사용 중인 아이디입니다.' };
  },

  /**
   * 닉네임 중복 확인
   * POST /auth/check-nick
   * @param {string} memberNick - 확인할 닉네임
   * @returns {Promise} 중복 확인 결과
   */
  checkNick: async (memberNick) => {
    const data = await checkNick(memberNick);
    return { success: data !== null, data, message: data?.available ? '사용 가능한 닉네임입니다.' : '이미 사용 중인 닉네임입니다.' };
  },
};

export default signupApi;
