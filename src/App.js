import Dashboard from "./Admin/Dashboard";
import LoginRegister from "./Admin/LoginRegister";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import Vendor from "./Vendor/Vendor";
import Navbar from "./Vendor/Navbar";
import Cart from "./Vendor/Cart";
import VendorLogin from "./Vendor/VendorLogin";

function App() {
  return (
    <>
      {/* <Home /> */}
      <Navbar />
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/vendorLogin" element={<VendorLogin />} />
        <Route path="/vendorDashboard" element={<Vendor />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </>
  );
}

export default App;
