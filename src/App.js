import Dashboard from "./Admin/Dashboard";
import LoginRegister from "./Admin/LoginRegister";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Home />
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
        <Route path="/login" element={<LoginRegister />} />
      </Routes>
    </>
  );
}

export default App;
