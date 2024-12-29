import Dashboard from "./Admin/Dashboard";
import LoginRegister from "./Admin/LoginRegister";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes, useLocation } from "react-router-dom";
import CustomerCare from "./CustomerCare/CustomerCare";
import Navbar from "./CustomerCare/Navbar";
import Cart from "./CustomerCare/Cart";
import CustomerCareLogin from "./CustomerCare/CustomerCareLogin";
import CustomerCareAllProducts from "./CustomerCare/CustomerCareAllProducts";
import CartPage from "./CustomerCare/CartPage";
import { useEffect, useState } from "react";
import VendorDashboard from "./Vendor/VendorDashboard";
import VendorLogin from "./Vendor/VendorLogin";

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false);
  const [customerCareLoggedIn, setCustomerCareLoggedIn] = useState(false);
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setAdminLoggedIn(true);
    } else {
      setAdminLoggedIn(false);
    }
  }, []);
  const location = useLocation(); // Get current location
  const isVendorRoute = location.pathname.startsWith("/admin");
  const isAdminRoute = location.pathname.startsWith("/vendor");

  return (
    <>
      {/* <Home /> */}
      {!isAdminRoute && !isVendorRoute && <Navbar customerCareLoggedIn={customerCareLoggedIn} />}
      {/* {!adminLoggedIn && <Navbar customerCareLoggedIn={customerCareLoggedIn} />} */}
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/vendor/*" element={<VendorDashboard />} />
        <Route
          path="/login"
          element={<LoginRegister setAdminLoggedIn={setAdminLoggedIn} />}
        />
        <Route
          path="/customerCareLogin"
          element={
            <CustomerCareLogin
              setAdminLoggedIn={setAdminLoggedIn}
              setCustomerCareLoggedIn={setCustomerCareLoggedIn}
            />
          }
        />
        <Route path="/vendorLogin" element={<VendorLogin />} />
        <Route path="/" element={<CustomerCare />} />
        <Route
          path="/customerCareDashboardNew"
          element={<CustomerCareAllProducts />}
        />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cartPage" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
