import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../../pages/auth/LoginPage";
import SignupPage from "../../pages/auth/SignupPage";
import FindIdPage from "../../pages/auth/FindIdPage";
import FindPasswordPage from "../../pages/auth/FindPasswordPage";
import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";

export default function AuthApp() {
  return (
    <div className="login-wrapper">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/auth/find-id" element={<FindIdPage />} />
        <Route path="/auth/find-pw" element={<FindPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Routes>
    </div>
  );
}
