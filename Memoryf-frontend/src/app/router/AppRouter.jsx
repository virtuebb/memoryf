import { isAuthenticated, getUserIdFromToken } from "../../shared/lib";

import AppProviders from "../providers/AppProviders";
import AdminApp from "./AdminApp";
import AuthApp from "./AuthApp";
import UserApp from "./UserApp";

export default function AppRouter() {
  const isLoggedIn = isAuthenticated();
  const isAdmin = getUserIdFromToken();

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
