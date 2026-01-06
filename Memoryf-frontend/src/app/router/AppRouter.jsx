import { useState, useEffect } from "react";
import { isAuthenticated, getUserIdFromToken } from "../../shared/lib";

import AppProviders from "../providers/AppProviders";
import AdminApp from "./AdminApp";
import AuthApp from "./AuthApp";
import UserApp from "./UserApp";

export default function AppRouter() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(() => getUserIdFromToken());

  // localStorage 변경 감지
  useEffect(() => {
    const checkAuth = () => {
      setIsLoggedIn(isAuthenticated());
      setIsAdmin(getUserIdFromToken());
    };

    // 초기 체크
    checkAuth();

    // storage 이벤트 리스너 (다른 탭에서 로그인/로그아웃 시)
    window.addEventListener("storage", checkAuth);

    // 커스텀 이벤트 리스너 (같은 탭에서 로그인 시)
    window.addEventListener("authStateChanged", checkAuth);

    return () => {
      window.removeEventListener("storage", checkAuth);
      window.removeEventListener("authStateChanged", checkAuth);
    };
  }, []);

  if (!isLoggedIn) {
    return <AuthApp />;
  }

  if (isLoggedIn && isAdmin === "admin") {
    return <AdminApp />;
  }

  return (
    <AppProviders>
      <UserApp />
    </AppProviders>
  );
}
