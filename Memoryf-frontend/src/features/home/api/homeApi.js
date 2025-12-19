import axios from 'axios';
import { getAccessToken } from '../../../utils/jwt';

// API Base URL
const API_BASE_URL = 'http://localhost:8006/memoryf';

// Axios 인스턴스 생성
const homeApi = axios.create({
  baseURL: `${API_BASE_URL}/home`,
  timeout: 10000,
  withCredentials: true,
});

// 요청 인터셉터에서 항상 최신 accessToken을 Authorization 헤더에 추가
homeApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const normalizeHome = (home) => {
  if (!home || typeof home !== 'object') return home;

  const normalizedIsFollowing =
    home.isFollowing ?? home.following ?? home.is_following ?? home.IS_FOLLOWING;

  return {
    ...home,
    isFollowing: Boolean(normalizedIsFollowing),
  };
};

/**
 * 회원 번호로 홈 조회 (RESTful: GET /home/{memberNo})
 * @param {number} memberNo - 조회할 회원 번호
 * @param {number} currentMemberNo - 현재 로그인한 회원 번호 (옵션)
 * @returns {Promise} 홈 정보
 */
export const getHomeByMemberNo = async (memberNo, currentMemberNo = null) => {
  try {
    const params = currentMemberNo ? { currentMemberNo } : {};
    const response = await homeApi.get(`/${memberNo}`, { params });
    
    if (response.data && response.data.success) {
      return normalizeHome(response.data.data);
    }
    return null;
  } catch (error) {
    console.error('홈 조회 실패:', error);
    throw error;
  }
};

/**
 * 회원 닉네임으로 홈 조회 (RESTful: GET /home/by-nick/{memberNick})
 * @param {string} memberNick - 조회할 회원 닉네임
 * @param {number} currentMemberNo - 현재 로그인한 회원 번호 (옵션)
 * @returns {Promise} 홈 정보
 */
export const getHomeByMemberNick = async (memberNick, currentMemberNo = null) => {
  try {
    const params = currentMemberNo ? { currentMemberNo } : {};
    const encoded = encodeURIComponent(memberNick);
    const response = await homeApi.get(`/by-nick/${encoded}`, { params });

    if (response.data && response.data.success) {
      return normalizeHome(response.data.data);
    }
    return null;
  } catch (error) {
    console.error('홈 조회 실패(닉네임):', error);
    throw error;
  }
};

/**
 * 홈 번호로 방명록 목록 조회 (RESTful: GET /home/{homeNo}/guestbook)
 * @param {number} homeNo - 홈 번호
 * @param {number} currentMemberNo - 현재 로그인한 회원 번호 (옵션)
 * @returns {Promise} 방명록 목록
 */
export const getGuestbookList = async (homeNo, currentMemberNo = null) => {
  try {
    const params = currentMemberNo ? { currentMemberNo } : {};
    const response = await homeApi.get(`/${homeNo}/guestbook`, { params });
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
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
    const response = await homeApi.post(`/${homeNo}/guestbook`, {
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
    const response = await homeApi.delete(`/${homeNo}/guestbook/${guestbookNo}`);
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
    const response = await homeApi.post(`/${homeNo}/guestbook/${guestbookNo}/likes`, {
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
export const uploadProfileImage = async (memberNo, file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await homeApi.post(`/${memberNo}/profile-image`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('프로필 이미지 업로드 실패:', error);
    throw error;
  }
};

/**
 * 프로필 정보 업데이트 (RESTful: PUT /home/{memberNo}/profile)
 * @param {number} memberNo - 회원 번호
 * @param {Object} profileData - { memberNick, statusMsg }
 * @returns {Promise} 업데이트 결과
 */
export const updateProfile = async (memberNo, profileData) => {
  try {
    const response = await homeApi.put(`/${memberNo}/profile`, profileData);
    return response.data;
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    throw error;
  }
};

export default homeApi;
