import { Routes, Route, Navigate } from "react-router-dom";

import { AdminLayout } from "../../features/admin";
import DashboardPage from "../../pages/admin/DashboardPage";
import UserManagementPage from "../../pages/admin/UserManagementPage";
import ReportManagementPage from "../../pages/admin/ReportManagementPage";
import PaymentManagementPage from "../../pages/admin/PaymentManagementPage";
import BgmManagementPage from "../../pages/admin/BgmManagementPage";

export default function AdminApp() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="reports" element={<ReportManagementPage />} />
        <Route path="payments" element={<PaymentManagementPage />} />
        <Route path="bgm" element={<BgmManagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
