import React, { useState, useEffect } from "react";
import { FaCartPlus } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ customerCareLoggedIn }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false); // State to toggle profile menu
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("customerCareToken");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [customerCareLoggedIn, isLoggedIn]);



  // Handle logout
  const handleLogout = () => {
    setShowProfileMenu(false)
    localStorage.removeItem("customerCareToken"); // Remove token from localStorage
    setIsLoggedIn(false); // Update state to reflect logged-out status
    navigate("/customerCareLogin"); // Redirect to login page
  };

  return (
    <nav className="bg-gray-800 p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo Section */}
        <div className="text-white text-2xl font-bold">
          <a href="/">Logo</a>
        </div>

        {/* Navigation Links (for larger screens) */}
        <div className="hidden md:flex space-x-6">
          <a href="/" className="text-white hover:text-gray-400">
            Home
          </a>
          <a href="/about" className="text-white hover:text-gray-400">
            About
          </a>
          <a href="/services" className="text-white hover:text-gray-400">
            Services
          </a>
          <a href="/contact" className="text-white hover:text-gray-400">
            Contact
          </a>
        </div>

        {/* Cart and Profile Section */}
        <div className="flex items-center space-x-4">
          {isLoggedIn ? (
            <>
              {/* Cart Icon */}
              <Link
                to="/cart"
                className="flex items-center text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <FaCartPlus className="mr-2" />
              </Link>

              {/* Profile Icon and Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)} // Toggle the profile menu
                  className="text-white"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14c4 0 6-4 6-6s-2-6-6-6-6 4-6 6 2 6 6 6zM12 14c2.5 0 4-2 4-4s-1.5-4-4-4-4 2-4 4 1.5 4 4 4z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 14c-4 0-6 1-6 3v1h12v-1c0-2-2-3-6-3z"
                    />
                  </svg>
                </button>

                {/* Profile Dropdown Menu */}
                {showProfileMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg py-2">
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-200"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            // Login Button
            <Link
              to="/customerCareLogin"
              className="text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <div className="md:hidden flex items-center">
        <button className="text-white">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu (Hidden on md and larger screens) */}
      <div className="md:hidden mt-4 space-y-4">
        <a href="/" className="block text-white hover:text-gray-400">
          Home
        </a>
        <a href="/about" className="block text-white hover:text-gray-400">
          About
        </a>
        <a href="/services" className="block text-white hover:text-gray-400">
          Services
        </a>
        <a href="/contact" className="block text-white hover:text-gray-400">
          Contact
        </a>
      </div>
    </nav>
  );
};

export default Navbar;
