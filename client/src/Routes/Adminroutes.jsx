import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../Context/PrivateRoute";
import ResponsiveDashboard from "@/Modules/Admin/ResponsiveDashboard";
import MenuForm from "@/Modules/Admin/Pages/Menu";
import MenuList from "@/Modules/Admin/Pages/Menulist";
import FranchiseForm from "@/Modules/Admin/Pages/Franchises";
import Franchiseslist from "@/Modules/Admin/Pages/Franchiseslist";
import GalleryPage from "@/Modules/Admin/Pages/Gallery";
import FranchiseGalleryPage from "@/Modules/Admin/Pages/Franchisesgallery";

const Adminroutes = () => {
  return (
    <Routes>
      <Route
        path="/admin"
        element={
          <PrivateRoute adminOnly={true}>
            <ResponsiveDashboard />
          </PrivateRoute>
        }
      >
        {/* ✅ Default route: redirect /admin to /admin/menu */}
        <Route index element={<Navigate to="/admin/menu" replace />} />

        <Route path="menu" element={<MenuForm />} />
        <Route path="menu-list" element={<MenuList />} />
        <Route path="franchises" element={<FranchiseForm/>} />
        <Route path="franchises-list" element={<Franchiseslist/>} />
        <Route path="gallery" element={<GalleryPage/>} />
        <Route path="franchises-image" element={<FranchiseGalleryPage/>} />
      </Route>
    </Routes>
  );
};

export default Adminroutes;
