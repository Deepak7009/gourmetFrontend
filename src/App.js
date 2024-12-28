import Dashboard from "./Admin/Dashboard";
import LoginRegister from "./Admin/LoginRegister";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Vendor from "./Vendor/Vendor";
import Navbar from "./Vendor/Navbar";
import Cart from "./Vendor/Cart";
import VendorLogin from "./Vendor/VendorLogin";
import VendorAllProducts from "./Vendor/VendorAllProducts";
import CartPage from "./Vendor/CartPage";
import { useEffect, useState } from "react";

function App() {
  const [adminLoggedIn, setAdminLoggedIn] = useState(false)
  const [vendorLoggedIn, setVendorLoggedIn] = useState(false)
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      setAdminLoggedIn(true)
    } else {
      setAdminLoggedIn(false)
    }
  }, [])
  return (
    <>
      {/* <Home /> */}
      {!adminLoggedIn && <Navbar vendorLoggedIn={vendorLoggedIn} />}
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegister setAdminLoggedIn={setAdminLoggedIn} />} />
        <Route path="/vendorLogin" element={<VendorLogin setAdminLoggedIn={setAdminLoggedIn} setVendorLoggedIn={setVendorLoggedIn}/>} />
        <Route path="/vendorDashboard" element={<Vendor />} />
        <Route path="/vendorDashboardNew" element={<VendorAllProducts />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/cartPage" element={<CartPage />} />
      </Routes>
    </>
  );
}

export default App;
