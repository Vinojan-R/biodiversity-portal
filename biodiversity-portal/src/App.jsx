import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminRoute from "./components/auth/AdminRoute";
import Layout from "./components/layout/Layout";

import LearnPage from "./pages/LearnPage";
import AdminPage from "./pages/AdminPage";
import AboutPage from "./pages/AboutPage";
import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import SpeciesDetailsPage from "./pages/SpeciesDetailsPage";
import SpeciesPage from "./pages/SpeciesPage";
import HelpPage from "./pages/HelpPage";
import ProfilePage from "./pages/ProfilePage";
import SettingsPage from "./pages/SettingsPage";
import ObservationDetailsPage from "./pages/ObservationDetailsPage";
import ExpertApplicationPage from "./pages/ExpertApplicationPage";
import ChatPage from "./pages/ChatPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route element={<Layout />}>
          <Route path="/map" element={<MapPage />} />
        </Route>

        {/* Routes that require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminPage />} />
            </Route>
            <Route path="/home" element={<HomePage />} />

            <Route path="/species" element={<SpeciesPage />} />

            <Route
              path="/species/:id"
              element={<SpeciesDetailsPage />}
            />

            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/observations/:id" element={<ObservationDetailsPage />} />
            <Route path="/learn" element={<LearnPage />} />
            <Route path="/education" element={<LearnPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/expert-application" element={<ExpertApplicationPage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;