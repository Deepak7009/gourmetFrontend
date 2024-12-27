import Dashboard from "./Admin/Dashboard";
import LoginRegister from "./Admin/LoginRegister";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";
import VendorDashboard from "./Vendor/VendorDashboard";

function App() {
  return (
    <>
      <Home />
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegister />} />
        <Route path="/vendorDashboard" element={<VendorDashboard />} />
      </Routes>
    </>
  );
}

export default App;
