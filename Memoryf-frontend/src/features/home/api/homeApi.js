/**
 * 🏠 Home(feature) API
 *
 * 홈 feature 내부에서 사용하는 API.
 * 여러 feature에서 공통으로 쓰는 홈/프로필 API는 entities/home로 하향되어 여기서는 re-export 합니다.
 */
import { baseApi, getApiResponseData } from "../../../shared/api";

export {
	getHomeByMemberNo,
	getHomeByMemberNick,
	uploadProfileImage,
	updateProfile,
} from "../../../entities/home";

/**
 * 회원 번호로 홈 조회 (RESTful: GET /home/{memberNo})
 * @param {number} memberNo - 조회할 회원 번호
 * @param {number} currentMemberNo - 현재 로그인한 회원 번호 (옵션)
 * @returns {Promise} 홈 정보
 */
// getHomeByMemberNo/getHomeByMemberNick/uploadProfileImage/updateProfile는 entities/home에서 re-export

/**
 * 홈 번호로 방명록 목록 조회 (RESTful: GET /home/{homeNo}/guestbook)
 * @param {number} homeNo - 홈 번호
 * @param {number} currentMemberNo - 현재 로그인한 회원 번호 (옵션)
 * @param {number} offset - 페이징 시작 위치 (기본값: 0)
 * @param {number} limit - 가져올 개수 (기본값: 3)
 * @returns {Promise} 방명록 목록
 */
export const getGuestbookList = async (homeNo, currentMemberNo = null, offset = 0, limit = 3) => {
  try {
    const params = { offset, limit };
    if (currentMemberNo) {
      params.currentMemberNo = currentMemberNo;
    }
    const response = await baseApi.get(`/home/${homeNo}/guestbook`, { params });

    return getApiResponseData(response.data, []);
  } catch (error) {
    console.error('방명록 조회 실패:', error);
    throw error;
  }
};

/**
 * 방명록 생성 (RESTful: POST /home/{homeNo}/guestbook)
 * @param {number} homeNo - 홈 번호
 * @param {string} guestbookContent - 방명록 내용
 * @param {number} memberNo - 작성자 회원 번호
 * @returns {Promise} 생성 결과
 */
export const createGuestbook = async (homeNo, guestbookContent, memberNo) => {
  try {
    const response = await baseApi.post(`/home/${homeNo}/guestbook`, {
      guestbookContent,
      memberNo,
    });
    return response.data;
  } catch (error) {
    console.error('방명록 생성 실패:', error);
    throw error;
  }
};

/**
 * 방명록 삭제 (RESTful: DELETE /home/{homeNo}/guestbook/{guestbookNo})
 * @param {number} homeNo - 홈 번호
 * @param {number} guestbookNo - 방명록 번호
 * @returns {Promise} 삭제 결과
 */
export const deleteGuestbook = async (homeNo, guestbookNo) => {
  try {
    const response = await baseApi.delete(`/home/${homeNo}/guestbook/${guestbookNo}`);
    return response.data;
  } catch (error) {
    console.error('방명록 삭제 실패:', error);
    throw error;
  }
};

/**
 * 방명록 좋아요 토글 (RESTful: POST /home/{homeNo}/guestbook/{guestbookNo}/likes)
 * @param {number} homeNo - 홈 번호
 * @param {number} guestbookNo - 방명록 번호
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 좋아요 결과
 */
export const toggleGuestbookLike = async (homeNo, guestbookNo, memberNo) => {
  try {
    const response = await baseApi.post(`/home/${homeNo}/guestbook/${guestbookNo}/likes`, {
      memberNo,
    });
    return response.data;
  } catch (error) {
    console.error('방명록 좋아요 실패:', error);
    throw error;
  }
};

/**
 * 프로필 이미지 업로드 (RESTful: POST /home/{memberNo}/profile-image)
 * @param {number} memberNo - 회원 번호
 * @param {File} file - 업로드할 이미지 파일
 * @returns {Promise} 업로드 결과 (profileChangeName 반환)
 */
// 기존 호환성을 위한 default export
export default baseApi;
