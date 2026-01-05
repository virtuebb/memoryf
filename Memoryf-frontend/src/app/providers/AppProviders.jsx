import { AuthProvider } from "../../features/auth";
import { DmProvider } from "../../features/dm";
import { ThemeProvider } from "../../shared/lib";

export default function AppProviders({ children }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <DmProvider>{children}</DmProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}
