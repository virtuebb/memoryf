/**
 * 🔐 JWT 토큰 유틸리티
 * 
 * JWT 토큰에서 사용자 정보를 추출하는 함수들
 */

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
 */
export const normalizeAccessToken = (rawToken) => {
  if (!rawToken) return null;

  let token = String(rawToken).trim();

  if (token.startsWith('"') && token.endsWith('"') && token.length > 1) {
    token = token.slice(1, -1).trim();
  }

  if (token.toLowerCase().startsWith('bearer ')) {
    token = token.slice(7).trim();
  }

  return token || null;
};

/**
 * localStorage에서 토큰 가져오기
 * @returns {string|null} 토큰 또는 null
 */
export const getAccessToken = () => {
  return normalizeAccessToken(localStorage.getItem('accessToken'));
};

/**
 * 토큰에서 로그인 아이디(subject) 추출
 * @returns {string|null} 사용자 ID 또는 null
 */
export const getUserIdFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  
  // JWT payload에서 사용자 ID 추출
  // 백엔드에서 subject(sub) 또는 별도 클레임을 사용
  return decoded.sub || decoded.memberId || decoded.userId || null;
};

/**
 * 토큰에서 회원 번호(memberNo) 추출
 * @returns {number|null} 회원 번호 또는 null
 */
export const getMemberNoFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);

  if (!decoded) return null;

  return decoded.memberNo ?? null;
};

/**
 * 토큰에서 사용자 이름 추출
 * @returns {string|null} 사용자 이름 또는 null
 */
export const getUserNameFromToken = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  
  return decoded.memberName || decoded.name || null;
};

/**
 * 토큰 만료 여부 확인
 * @returns {boolean} 만료되었으면 true
 */
export const isTokenExpired = () => {
  const token = getAccessToken();
  const decoded = decodeToken(token);
  
  if (!decoded || !decoded.exp) return true;
  
  // exp는 초 단위, Date.now()는 밀리초 단위
  return decoded.exp * 1000 < Date.now();
};

/**
 * 로그인 여부 확인
 * @returns {boolean} 유효한 토큰이 있으면 true
 */
export const isAuthenticated = () => {
  const token = getAccessToken();
  return !!(token && !isTokenExpired());
};
