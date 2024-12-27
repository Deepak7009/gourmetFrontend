import Dashboard from "./Admin/Dashboard";
import "./App.css";
import Home from "./components/Home";
import { Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <Home />
      <Routes>
        <Route path="/admin/*" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default App;
