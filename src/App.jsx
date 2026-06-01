import { Navigate, Route, Routes } from "react-router-dom";
import { AdminLayout } from "./components/AdminLayout";
import { AppProvider, useApp } from "./context/AppContext";
import EstimatePage from "./pages/EstimatePage";
import LandingPage from "./pages/LandingPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ContentPage from "./pages/admin/ContentPage";
import LeadDetailPage from "./pages/admin/LeadDetailPage";
import LeadsPage from "./pages/admin/LeadsPage";
import LoginPage from "./pages/admin/LoginPage";
import SettingsPage from "./pages/admin/SettingsPage";

export default function App() {
  return <AppProvider><Routes><Route path="/" element={<LandingPage />} /><Route path="/estimate" element={<EstimatePage />} /><Route path="/admin/login" element={<LoginPage />} /><Route path="/admin" element={<ProtectedAdmin />}><Route index element={<AdminDashboard />} /><Route path="leads" element={<LeadsPage />} /><Route path="leads/:id" element={<LeadDetailPage />} /><Route path="content" element={<ContentPage />} /><Route path="settings" element={<SettingsPage />} /></Route><Route path="*" element={<Navigate to="/" replace />} /></Routes></AppProvider>;
}

function ProtectedAdmin() {
  const { session, loading } = useApp();
  if (loading) return <div className="grid min-h-screen place-items-center text-sm font-bold text-slate-500">Loading admin...</div>;
  return session ? <AdminLayout /> : <Navigate to="/admin/login" replace />;
}
