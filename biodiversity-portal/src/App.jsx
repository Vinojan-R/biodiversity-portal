import { BrowserRouter, Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/auth/ProtectedRoute";
import Layout from "./components/layout/Layout";

import EducationPage from "./pages/EducationPage";
import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import RegisterPage from "./pages/RegisterPage";
import SpeciesDetailsPage from "./pages/SpeciesDetailsPage";
import SpeciesPage from "./pages/SpeciesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Routes that require login */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<HomePage />} />

            <Route path="/species" element={<SpeciesPage />} />

            <Route
              path="/species/:id"
              element={<SpeciesDetailsPage />}
            />

            <Route path="/identify" element={<IdentifyPage />} />
            <Route path="/map" element={<MapPage />} />
            <Route path="/education" element={<EducationPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;