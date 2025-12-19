import axios from 'axios';
import { getAccessToken, getMemberNoFromToken } from '../../../utils/jwt';

// API Base URL (SOLID: Single Responsibility - API 호출만 담당)
const API_BASE_URL = 'http://localhost:8006/memoryf';
export { API_BASE_URL };

// Axios 인스턴스 생성 (RESTful API 원칙 준수)
// ⚠️ JWT 적용 후 accessToken 사용 & 매 요청마다 헤더에 실어보내도록 수정
const feedApi = axios.create({
  baseURL: `${API_BASE_URL}/feeds`,
  timeout: 10000, // 10초 타임아웃
  withCredentials: true, // CORS 문제 방지
});

// 요청 인터셉터에서 항상 최신 accessToken을 Authorization 헤더에 추가
feedApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * 피드 목록 조회 (RESTful: GET /feeds)
 * @param {string} sortBy - 정렬 기준 ('popular' | 'following' | 'recent')
 * @returns {Promise} 피드 목록 데이터
 */
export const getFeedList = async (sortBy = 'recent', page = 0, size = 18) => {
  try {
    const memberNo = getMemberNoFromToken();
    const params = { sortBy, page, size };
    if (memberNo) params.memberNo = memberNo;

    const response = await feedApi.get('', {
      params,
      timeout: 10000, // 10초 타임아웃
    });
    
    console.log('API 전체 응답:', response); // 디버깅용
    console.log('response.data:', response.data); // 디버깅용
    
    // 백엔드 응답 구조에 맞게 수정
    if (response.data && response.data.success) {
      const data = response.data.data;
      console.log('응답 데이터:', data); // 디버깅용
      if (Array.isArray(data)) {
        return data;
      }
      // data가 null이거나 undefined인 경우 빈 배열 반환
      return [];
    }
    // 배열이면 그대로 반환
    if (Array.isArray(response.data)) {
      return response.data;
    }
    return [];
  } catch (error) {
    // 네트워크 오류 상세 정보 로깅
    if (error.code === 'ERR_NETWORK') {
      console.error('네트워크 오류: 백엔드 서버가 실행 중인지 확인하세요.');
      console.error('요청 URL:', `${feedApi.defaults.baseURL}?sortBy=${sortBy}&page=${page}&size=${size}`);
    } else if (error.response) {
      // 서버 응답이 있는 경우
      console.error('서버 응답 오류:', error.response.status, error.response.data);
    } else {
      console.error('피드 목록 조회 실패:', error.message);
    }
    throw error;
  }
};

/**
 * 피드 상세 조회 (RESTful: GET /feeds/:id)
 * @param {number} feedNo - 피드 번호
 * @returns {Promise} 피드 상세 데이터
 */
export const getFeedDetail = async (feedNo) => {
  try {
    const memberNo = getMemberNoFromToken();
    const params = {};
    if (memberNo) params.memberNo = memberNo;

    const response = await feedApi.get(`/${feedNo}`, {
      params
    });
    // 백엔드 응답 구조에 맞게 수정
    if (response.data && response.data.success && response.data.data) {
      return response.data.data;
    }
    return response.data;
  } catch (error) {
    console.error('피드 상세 조회 실패:', error);
    throw error;
  }
};

/**
 * 피드 생성 (RESTful: POST /feeds)
 * @param {FormData} formData - 피드 데이터 (multipart/form-data)
 * @returns {Promise} 생성된 피드 데이터
 */
export const createFeed = async (formData) => {
  try {
    // JWT 인증이 필요한 엔드포인트이므로 feedApi 사용 + 토큰 자동 첨부
    const response = await feedApi.post('', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 파일 업로드는 시간이 걸릴 수 있으므로 30초로 설정
    });
    return response.data;
  } catch (error) {
    // 네트워크 오류 상세 정보 로깅
    if (error.code === 'ERR_NETWORK') {
      console.error('네트워크 오류: 백엔드 서버가 실행 중인지 확인하세요.');
      console.error('요청 URL:', `${API_BASE_URL}/feeds`);
    } else if (error.response) {
      // 서버 응답이 있는 경우
      console.error('서버 응답 오류:', error.response.status, error.response.data);
    } else {
      console.error('피드 생성 실패:', error.message);
    }
    throw error;
  }
};

/**
 * 피드 좋아요 (RESTful: POST /feeds/:id/likes)
 * @param {number} feedNo - 피드 번호
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 좋아요 결과
 */
export const likeFeed = async (feedNo, memberNo) => {
  try {
    const response = await feedApi.post(`/${feedNo}/likes`, {
      memberNo,
    });
    return response.data;
  } catch (error) {
    console.error('피드 좋아요 실패:', error);
    throw error;
  }
};

/**
 * 피드 삭제 (DELETE /feeds/:id)
 */
export const deleteFeed = async (feedNo) => {
  try {
    const response = await feedApi.delete(`/${feedNo}`);
    return response.data;
  } catch (error) {
    console.error('피드 삭제 실패:', error);
    throw error;
  }
};

/**
 * 피드 수정 (PUT /feeds/:id)
 * @param {number} feedNo
 * @param {{content?: string, tag?: string, latitude?: string, longitude?: string}} payload
 */
export const updateFeed = async (feedNo, payload) => {
  try {
    const response = await feedApi.put(`/${feedNo}`, payload);
    return response.data;
  } catch (error) {
    console.error('피드 수정 실패:', error);
    throw error;
  }
};

/**
 * 피드 북마크 토글 (RESTful: POST /feeds/:id/bookmarks)
 * @param {number} feedNo - 피드 번호
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 북마크 결과
 */
export const toggleFeedBookmark = async (feedNo, memberNo) => {
  try {
    const response = await feedApi.post(`/${feedNo}/bookmarks`, {
      memberNo,
    });
    return response.data;
  } catch (error) {
    console.error('피드 북마크 실패:', error);
    throw error;
  }
};

/**
 * 특정 피드의 댓글 목록 조회 (RESTful: GET /feeds/:id/comments)
 * @param {number} feedNo - 피드 번호
 * @returns {Promise} 댓글 목록
 */
export const getComments = async (feedNo) => {
  try {
    const memberNo = getMemberNoFromToken();
    const params = {};
    if (memberNo) params.memberNo = memberNo;

    const response = await feedApi.get(`/${feedNo}/comments`, {
      params
    });
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('댓글 조회 실패:', error);
    throw error;
  }
};

/**
 * 댓글 생성 (RESTful: POST /feeds/:id/comments)
 * @param {number} feedNo - 피드 번호
 * @param {string} content - 댓글 내용
 * @param {number} writer - 작성자 회원 번호
 * @returns {Promise} 생성 결과
 */
export const createComment = async (feedNo, content, writer) => {
  try {
    const response = await feedApi.post(`/${feedNo}/comments`, {
      content,
      writer,
    });
    return response.data;
  } catch (error) {
    console.error('댓글 생성 실패:', error);
    throw error;
  }
};

/**
 * 댓글 삭제 (RESTful: DELETE /feeds/:feedNo/comments/:commentNo)
 * @param {number} feedNo - 피드 번호
 * @param {number} commentNo - 댓글 번호
 * @returns {Promise} 삭제 결과
 */
export const deleteComment = async (feedNo, commentNo) => {
  try {
    const response = await feedApi.delete(`/${feedNo}/comments/${commentNo}`);
    return response.data;
  } catch (error) {
    console.error('댓글 삭제 실패:', error);
    throw error;
  }
};

/**
 * 댓글 좋아요 토글 (RESTful: POST /feeds/:feedNo/comments/:commentNo/likes)
 * @param {number} feedNo - 피드 번호
 * @param {number} commentNo - 댓글 번호
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 좋아요 결과
 */
export const toggleCommentLike = async (feedNo, commentNo, memberNo) => {
  try {
    const response = await feedApi.post(`/${feedNo}/comments/${commentNo}/likes`, {
      memberNo,
    });
    return response.data;
  } catch (error) {
    console.error('댓글 좋아요 실패:', error);
    throw error;
  }
};

/**
 * 북마크한 피드 목록 조회 (RESTful: GET /feeds/bookmarked)
 * @param {number} memberNo - 회원 번호
 * @returns {Promise} 북마크한 피드 목록
 */
export const getBookmarkedFeedList = async (memberNo) => {
  try {
    const response = await feedApi.get('/bookmarked', {
      params: { memberNo },
    });
    
    if (response.data && response.data.success) {
      return response.data.data;
    }
    return [];
  } catch (error) {
    console.error('북마크 피드 조회 실패:', error);
    throw error;
  }
};

export default feedApi;
