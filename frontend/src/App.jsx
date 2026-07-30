import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { Toaster } from "react-hot-toast";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Radios from "./pages/Radios/Radios";
import Admin from "./pages/Admin/Admin";
import Internos from "./pages/Internos/Internos";
import Rtu from "./pages/Rtu/Rtu";
import ProtectedRoute from "./routes/ProtectedRoute";
import ProtectedLayout from "./routes/ProtectedLayout";
import Engrasadoras from "./pages/Engrasadoras/Engrasadoras";

function App() {
  useEffect(() => {
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/rtu" element={<Rtu />} />
            <Route path="/engrasadoras" element={<Engrasadoras />} />
            <Route path="/engrasadoras/:linea" element={<Engrasadoras />} />
            <Route path="/radios" element={<Radios />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/internos" element={<Internos />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
