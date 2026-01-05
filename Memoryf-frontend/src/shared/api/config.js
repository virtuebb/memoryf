/**
 * 🌐 공통 API 설정
 * 
 * 모든 API 요청에서 사용하는 단일 설정 파일
 * - 환경별 Base URL 관리
 * - 타임아웃 설정
 */

/**
 * 동적 Base URL 생성
 * - localhost 접속 시: localhost 사용
 * - 네트워크 IP 접속 시: 해당 IP 사용
 */
export const getBaseURL = () => {
  const hostname = window.location.hostname;
  const port = import.meta.env.VITE_API_PORT || '8006';
  const contextPath = import.meta.env.VITE_API_CONTEXT || '/memoryf';
  
  return `http://${hostname}:${port}${contextPath}`;
};

// 호환성/편의: Base URL 상수
export const API_BASE_URL = getBaseURL();

/**
 * API 기본 설정
 */
export const API_CONFIG = {
  timeout: 15000,           // 15초 타임아웃
  uploadTimeout: 60000,     // 파일 업로드: 60초
  withCredentials: true,    // CORS 쿠키 전송
};

/**
 * 공개 API 경로 (토큰 불필요)
 */
export const PUBLIC_PATHS = [
  '/auth/login',
  '/auth/signup',
  '/auth/find',
  '/login',
  '/signup',
  '/find',
];

/**
 * 공개 경로인지 확인
 * @param {string} url - 요청 URL
 * @returns {boolean}
 */
export const isPublicPath = (url) => {
  if (!url) return false;
  return PUBLIC_PATHS.some(path => url.startsWith(path));
};
