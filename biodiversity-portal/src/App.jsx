import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/layout/Layout";
import EducationPage from "./pages/EducationPage";
import HomePage from "./pages/HomePage";
import IdentifyPage from "./pages/IdentifyPage";
import LoginPage from "./pages/LoginPage";
import MapPage from "./pages/MapPage";
import NotFoundPage from "./pages/NotFoundPage";
import SpeciesPage from "./pages/SpeciesPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/species" element={<SpeciesPage />} />
          <Route path="/identify" element={<IdentifyPage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;