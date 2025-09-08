// src/routes/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Homesection from "./Homesection";
import Login from "@/auth/Login";
import Adminroutes from "./Adminroutes";
import PrivateRoute from "../Context/PrivateRoute";
import Contact from "@/Modules/Pages/Contact";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Homesection />} />
      <Route path="/menu" element={<>menu</>} />
      <Route path="/franchise" element={<>franchise</>} />
      <Route path="/contact" element={<Contact/>} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/*"
        element={
          <PrivateRoute adminOnly={true}>
            <Adminroutes />
          </PrivateRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;