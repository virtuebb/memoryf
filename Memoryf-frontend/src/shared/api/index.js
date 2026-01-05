/**
 * 📦 shared/api Public API
 * 
 * 외부에서 사용할 수 있는 API 관련 모듈 export
 */

// API 인스턴스
export { 
  baseApi, 
  uploadApi,
  get,
  post,
  put,
  del,
  upload,
} from './baseApi';

// API 설정
export { 
  getBaseURL, 
  API_BASE_URL,
  API_CONFIG, 
  PUBLIC_PATHS,
  isPublicPath,
} from './config';

// Feature-agnostic API modules
// Note: visitorApi moved to entities/visitor/api

// ApiResponse helpers
export * from './response';

// Asset URL helpers
export * from './assets';
