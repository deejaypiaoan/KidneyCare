import { Suspense, useEffect } from "react";
import { useRoutes, Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/home";
import routes from "tempo-routes";
import MonitoringDashboard from "./components/monitoring/MonitoringDashboard";
import MedicationManager from "./components/medication/MedicationManager";
import DialysisCalendar from "./components/calendar/DialysisCalendar";
import NutritionTracker from "./components/nutrition/NutritionTracker";
import PatientProfile from "./components/profile/PatientProfile";
import NotificationsPage from "./components/routes/NotificationsPage";
import DialysisSessionPage from "./components/routes/DialysisSessionPage";
import AuthPage from "./components/routes/AuthPage";
import AdminDashboard from "./components/admin/AdminDashboard";
import PatientRegistration from "./components/admin/PatientRegistration";
import PatientManagement from "./components/admin/PatientManagement";
import PatientAccountForm from "./components/admin/PatientAccountForm";
import { isAuthenticated } from "./lib/auth";

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/auth" replace />;
  }
  return <>{children}</>;
};

function App() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="auth" element={<AuthPage />} />

          {/* Patient Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/monitoring"
            element={
              <ProtectedRoute>
                <MonitoringDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/medication"
            element={
              <ProtectedRoute>
                <MedicationManager />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <DialysisCalendar />
              </ProtectedRoute>
            }
          />
          <Route
            path="/nutrition"
            element={
              <ProtectedRoute>
                <NutritionTracker />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <PatientProfile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/session"
            element={
              <ProtectedRoute>
                <DialysisSessionPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients"
            element={
              <ProtectedRoute>
                <PatientManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/register"
            element={
              <ProtectedRoute>
                <PatientRegistration />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/patients/create"
            element={
              <ProtectedRoute>
                <PatientAccountForm />
              </ProtectedRoute>
            }
          />

          {/* Default route - redirect to auth */}
          <Route path="*" element={<AuthPage />} />

          {import.meta.env.VITE_TEMPO === "true" && (
            <Route path="/tempobook/*" />
          )}
        </Routes>
        {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
      </>
    </Suspense>
  );
}

export default App;
