import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import AppErrorBoundary from "./components/ui/AppErrorBoundary";
import { AuthProvider } from "./context/AuthContext";
import { AnimatedRoutes } from "./routes/AppRoutes";
import RouteSEO from "./routes/RouteSEO";

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <AppErrorBoundary>
            <RouteSEO />
            <AnimatedRoutes />
          </AppErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </HelmetProvider>
  );
}
