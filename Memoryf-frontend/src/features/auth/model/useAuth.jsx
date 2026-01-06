/**
 * AuthContext - 인증 상태 관리
 * 
 * Context API 기반 반응형 인증 상태 관리
 * localStorage는 지속성 용도로만 사용
 */
import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { decodeToken, isTokenExpired, removeTokens, setTokens } from '../../../shared/lib';

const AuthContext = createContext(null);

/**
 * AuthProvider - 인증 상태를 제공하는 Provider
 */
export function AuthProvider({ children }) {
  const [accessToken, setAccessTokenState] = useState(() => localStorage.getItem('accessToken'));
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('accessToken');
    return token ? decodeToken(token) : null;
  });
  const [isLoading, setIsLoading] = useState(true);

  // 초기화: 토큰 유효성 검사
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token && !isTokenExpired(token)) {
      setAccessTokenState(token);
      setUser(decodeToken(token));
    } else if (token) {
      // 만료된 토큰 제거
      removeTokens();
      setAccessTokenState(null);
      setUser(null);
    }
    
    setIsLoading(false);
  }, []);

  // 로그인
  const login = useCallback((newAccessToken, newRefreshToken) => {
    setTokens(newAccessToken, newRefreshToken);
    setAccessTokenState(newAccessToken);
    setUser(decodeToken(newAccessToken));
  }, []);

  // 로그아웃
  const logout = useCallback(() => {
    removeTokens();
    setAccessTokenState(null);
    setUser(null);
    // AppRouter에 인증 상태 변경 알림
    window.dispatchEvent(new Event('authStateChanged'));
  }, []);

  // 토큰 갱신
  const updateToken = useCallback((newAccessToken) => {
    localStorage.setItem('accessToken', newAccessToken);
    setAccessTokenState(newAccessToken);
    setUser(decodeToken(newAccessToken));
  }, []);

  // Memoized context value
  const value = useMemo(() => ({
    // 상태
    accessToken,
    user,
    isLoading,
    isAuthenticated: !!accessToken && !isTokenExpired(accessToken),
    
    // 사용자 정보 (편의 접근자)
    memberNo: user?.memberNo ?? null,
    memberId: user?.memberId ?? null,
    memberNick: user?.memberNick ?? null,
    memberName: user?.memberName ?? null,
    
    // 액션
    login,
    logout,
    updateToken,
  }), [accessToken, user, isLoading, login, logout, updateToken]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * useAuth - 인증 상태 접근 Hook
 * 
 * @returns {Object} 인증 상태 및 액션
 * @throws {Error} AuthProvider 외부에서 사용 시 에러
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

/**
 * useRequireAuth - 인증 필수 페이지용 Hook
 * 
 * 로그인하지 않은 경우 자동으로 로그인 페이지로 리다이렉트
 */
export function useRequireAuth(redirectTo = '/login') {
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      window.location.href = redirectTo;
    }
  }, [isAuthenticated, isLoading, redirectTo]);
  
  return { isAuthenticated, isLoading };
}

// 하위 호환성: 기존 getAccessToken, getLoginMember 유지
export const getAccessToken = () => localStorage.getItem('accessToken');

export const getLoginMember = () => {
  const raw = localStorage.getItem('loginMember');
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export default useAuth;
