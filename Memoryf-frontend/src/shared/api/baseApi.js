/**
 * 🌐 공통 API 인스턴스 (Singleton)
 * 
 * 모든 feature/entity에서 이 인스턴스를 import하여 사용
 * - 단일 axios 인스턴스로 일관된 설정 유지
 * - 자동 토큰 첨부
 * - 토큰 갱신 로직 (401 에러 시)
 * - 에러 처리 통합
 */
import axios from 'axios';
import { getBaseURL, API_CONFIG, isPublicPath } from './config';
import { 
  getAccessToken, 
  getRefreshToken, 
  setTokens, 
  removeTokens 
} from '../lib/token';
import { getApiResponseData } from './response';

/**
 * 기본 API 인스턴스
 */
export const baseApi = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * 파일 업로드용 API 인스턴스
 */
export const uploadApi = axios.create({
  baseURL: getBaseURL(),
  timeout: API_CONFIG.uploadTimeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// ==================== 인터셉터 ====================

/**
 * 요청 인터셉터 - 토큰 자동 첨부
 */
const requestInterceptor = (config) => {
  const token = getAccessToken();
  const url = config.url || '';
  
  // 공개 경로가 아니고 토큰이 있으면 헤더에 추가
  if (token && !isPublicPath(url)) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
};

/**
 * 요청 에러 인터셉터
 */
const requestErrorInterceptor = (error) => {
  console.error('[API Request Error]', error);
  return Promise.reject(error);
};

/**
 * 응답 성공 인터셉터
 */
const responseInterceptor = (response) => {
  return response;
};

/**
 * 토큰 갱신 상태 관리 (중복 요청 방지)
 */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

/**
 * 응답 에러 인터셉터 - 토큰 갱신 로직 포함
 */
const responseErrorInterceptor = async (error) => {
  const originalRequest = error.config;
  
  // 네트워크 에러
  if (error.code === 'ERR_NETWORK') {
    console.error('[Network Error] 서버에 연결할 수 없습니다.');
    return Promise.reject(error);
  }
  
  // 타임아웃
  if (error.code === 'ECONNABORTED') {
    console.error('[Timeout] 요청 시간이 초과되었습니다.');
    return Promise.reject(error);
  }
  
  // 401 에러 & 재시도 아닌 경우
  if (error.response?.status === 401 && !originalRequest._retry) {
    // 이미 토큰 갱신 중이면 대기열에 추가
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return baseApi(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }
    
    originalRequest._retry = true;
    isRefreshing = true;
    
    const refreshToken = getRefreshToken();
    
    if (!refreshToken) {
      // Refresh 토큰 없음 - 로그아웃 처리
      isRefreshing = false;
      removeTokens();
      // 로그인 페이지로 리다이렉트 (선택적)
      // window.location.href = '/login';
      return Promise.reject(error);
    }
    
    try {
      // 토큰 갱신 요청
      const response = await axios.post(`${getBaseURL()}/auth/refresh`, {
        refreshToken,
      });
      
      const tokenPayload = getApiResponseData(response.data, null) ?? response.data;
      const { accessToken, refreshToken: newRefreshToken } = tokenPayload || {};
      setTokens(accessToken, newRefreshToken);
      
      // 대기 중인 요청 처리
      processQueue(null, accessToken);
      
      // 원래 요청 재시도
      originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      return baseApi(originalRequest);
      
    } catch (refreshError) {
      // 토큰 갱신 실패 - 로그아웃 처리
      processQueue(refreshError, null);
      removeTokens();
      // window.location.href = '/login';
      return Promise.reject(refreshError);
      
    } finally {
      isRefreshing = false;
    }
  }
  
  return Promise.reject(error);
};

// 인터셉터 적용
baseApi.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
baseApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

uploadApi.interceptors.request.use(requestInterceptor, requestErrorInterceptor);
uploadApi.interceptors.response.use(responseInterceptor, responseErrorInterceptor);

// ==================== 헬퍼 함수 ====================

/**
 * GET 요청 헬퍼
 * @param {string} url - 요청 URL
 * @param {object} params - 쿼리 파라미터
 * @param {object} config - axios 설정
 */
export const get = (url, params = {}, config = {}) => {
  return baseApi.get(url, { params, ...config });
};

/**
 * POST 요청 헬퍼
 * @param {string} url - 요청 URL
 * @param {object} data - 요청 바디
 * @param {object} config - axios 설정
 */
export const post = (url, data = {}, config = {}) => {
  return baseApi.post(url, data, config);
};

/**
 * PUT 요청 헬퍼
 */
export const put = (url, data = {}, config = {}) => {
  return baseApi.put(url, data, config);
};

/**
 * DELETE 요청 헬퍼
 */
export const del = (url, config = {}) => {
  return baseApi.delete(url, config);
};

/**
 * 파일 업로드 헬퍼
 * @param {string} url - 요청 URL
 * @param {FormData} formData - 폼 데이터
 * @param {function} onProgress - 업로드 진행률 콜백
 */
export const upload = (url, formData, onProgress) => {
  return uploadApi.post(url, formData, {
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
};

export default baseApi;
