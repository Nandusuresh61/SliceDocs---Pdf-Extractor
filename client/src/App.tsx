import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import DocumentPreview from "./pages/DocumentPreview";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "sonner";
import { APP_ROUTES } from "./constants/routes";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route 
          path={APP_ROUTES.LOGIN} 
          element={!isAuthenticated ? <Login /> : <Navigate to={APP_ROUTES.HOME} />} 
        />
        <Route 
          path={APP_ROUTES.HOME} 
          element={isAuthenticated ? <Home /> : <Navigate to={APP_ROUTES.LOGIN} />} 
        />
        <Route 
          path={APP_ROUTES.DOCUMENT_PREVIEW} 
          element={isAuthenticated ? <DocumentPreview /> : <Navigate to={APP_ROUTES.LOGIN} />} 
        />
      </Routes>
    </>
  );
}

export default App;