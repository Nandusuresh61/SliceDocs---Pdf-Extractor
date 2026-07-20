import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "sonner";

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route 
          path="/login" 
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />} 
        />
        <Route 
          path="/" 
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />} 
        />
      </Routes>
    </>
  );
}

export default App;