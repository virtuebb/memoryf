/**
 * 🔐 JWT 토큰 유틸리티
 * 
 * 토큰 저장, 조회, 삭제 및 디코딩 기능
 * shared/lib에 위치하여 모든 레이어에서 사용 가능
 */

const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';

/**
 * JWT 토큰 디코딩
 * @param {string} token - JWT 토큰
 * @returns {object|null} 디코딩된 payload 또는 null
 */
export const decodeToken = (token) => {
  if (!token) return null;
  
  try {
    // JWT는 header.payload.signature 구조
    const payload = token.split('.')[1];
    // Base64 디코딩
    const decoded = JSON.parse(atob(payload));
    return decoded;
  } catch (e) {
    console.error('JWT 토큰 디코딩 실패:', e);
    return null;
  }
};

/**
 * accessToken 저장값 정규화
 * - 앞뒤 공백 제거
 * - 따옴표로 감싸진 문자열 제거
 * - 'Bearer ' 접두사 제거
 * @param {string} rawToken - 원본 토큰
 * @returns {string|null} 정규화된 토큰
 */
export const normalizeToken = (rawToken) => {
  if (!rawToken) return null;

  let token = String(rawToken).trim();

  // 따옴표 제거
  if (token.startsWith('"') && token.endsWith('"') && token.length > 1) {
    token = token.slice(1, -1).trim();
  }

  // Bearer 접두사 제거
  if (token.toLowerCase().startsWith('bearer ')) {
    token = token.slice(7).trim();
  }

  return token || null;
};

// ==================== 토큰 저장/조회/삭제 ====================

/**
 * Access Token 저장
 * @param {string} token
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(ACCESS_TOKEN_KEY, normalizeToken(token));
  }
};

/**
 * Refresh Token 저장
 * @param {string} token
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(REFRESH_TOKEN_KEY, normalizeToken(token));
  }
};

/**
 * 토큰 일괄 저장
 * @param {string} accessToken
 * @param {string} refreshToken
 */
export const setTokens = (accessToken, refreshToken) => {
  setAccessToken(accessToken);
  if (refreshToken) {
    setRefreshToken(refreshToken);
  }
};

/**
 * Access Token 조회
 * @returns {string|null}
 */
export const getAccessToken = () => {
  return normalizeToken(localStorage.getItem(ACCESS_TOKEN_KEY));
};

/**
 * Refresh Token 조회
 * @returns {string|null}
 */
export const getRefreshToken = () => {
  return normalizeToken(localStorage.getItem(REFRESH_TOKEN_KEY));
};

/**
 * 모든 토큰 삭제
 */
export const removeTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

// ==================== 토큰 정보 추출 ====================

/**
 * 토큰에서 사용자 ID(subject) 추출
 * @returns {string|null}
 */
export const getUserIdFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  
  return decoded.sub || decoded.memberId || decoded.userId || null;
};

/**
 * 토큰에서 회원 번호(memberNo) 추출
 * @returns {number|null}
 */
export const getMemberNoFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);

  if (!decoded) return null;

  return decoded.memberNo ?? null;
};

/**
 * 토큰에서 사용자 이름 추출
 * @returns {string|null}
 */
export const getUserNameFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  
  return decoded.memberName || decoded.name || null;
};

/**
 * 토큰에서 닉네임 추출
 * @returns {string|null}
 */
export const getNickNameFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  
  return decoded.memberNick || decoded.nickname || null;
};

// ==================== 토큰 유효성 검사 ====================

/**
 * 토큰 만료 여부 확인
 * @returns {boolean} 만료되었으면 true
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) return true;
  
  // exp는 초 단위, Date.now()는 밀리초 단위
  // 30초 여유를 두고 만료 판단 (네트워크 지연 고려)
  return decoded.exp * 1000 < Date.now() + 30000;
};

/**
 * 로그인 여부 확인
 * @returns {boolean} 유효한 토큰이 있으면 true
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!(token && !isTokenExpired());
};

/**
 * 토큰 만료까지 남은 시간 (밀리초)
 * @returns {number} 남은 시간 (만료시 0)
 */
export const getTokenRemainingTime = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) return 0;
  
  const remaining = decoded.exp * 1000 - Date.now();
  return remaining > 0 ? remaining : 0;
};
