import { BrowserRouter as Router, useLocation } from "react-router-dom";
import Navbar from "./Modules/Layout/Navbar";
import AppRoutes from "./Routes/Routes"; // make sure the path is correct
import Footer from "./Modules/Layout/Footer";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";

function AppContent() {
  const location = useLocation();

  // Hide Navbar/Footer on admin routes
  const hideLayout = location.pathname.startsWith("/admin");

  return (
    <>
      {!hideLayout && <Navbar />}
      <AppRoutes />
      {!hideLayout && <Footer />}
      <ToastContainer />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
