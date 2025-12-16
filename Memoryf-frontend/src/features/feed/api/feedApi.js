import axios from 'axios';

// API Base URL (SOLID: Single Responsibility - API 호출만 담당)
const API_BASE_URL = 'http://localhost:8006/memoryf';
export { API_BASE_URL };

// Axios 인스턴스 생성 (RESTful API 원칙 준수)
const feedApi = axios.create({
  baseURL: `${API_BASE_URL}/feeds`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
  withCredentials: false, // CORS 문제 방지
});

/**
 * 피드 목록 조회 (RESTful: GET /feeds)
 * @param {string} sortBy - 정렬 기준 ('popular' | 'following' | 'recent')
 * @returns {Promise} 피드 목록 데이터
 */
export const getFeedList = async (sortBy = 'recent') => {
  try {
    const response = await feedApi.get('', {
      params: {
        sortBy, // RESTful: 쿼리 파라미터로 필터링
      },
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
      console.error('요청 URL:', `${feedApi.defaults.baseURL}?sortBy=${sortBy}`);
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
    const response = await feedApi.get(`/${feedNo}`);
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
    const response = await axios.post(`${API_BASE_URL}/feeds`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      withCredentials: true, // 세션 쿠키 포함
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

export default feedApi;
