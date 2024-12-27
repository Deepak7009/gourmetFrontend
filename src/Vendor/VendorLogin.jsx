import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { baseUrl } from "../utils/const";

const VendorLogin = () => {
  const navigate = useNavigate();

  // State for form data and loading/error states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Send login request
      const response = await axios.post(`${baseUrl}vendor/login`, {
        email,
        password,
      });

      // Handle successful response
      if (response.status === 200) {
        // Save token to localStorage
        localStorage.setItem("vendorToken", response.data.token);

        // Navigate to vendor dashboard
        navigate("/vendorDashboard");
      }
    } catch (err) {
      // Handle error
      setError(
        err.response?.data?.msg || "An error occurred. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold text-center mb-4">Vendor Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-semibold">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-sm font-semibold">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md"
            required
          />
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <div className="text-center">
          <button
            type="submit"
            disabled={loading}
            className={`w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md ${
              loading ? "opacity-50" : ""
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default VendorLogin;
