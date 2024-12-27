import React from "react";
import { FaCartPlus } from "react-icons/fa";
import { Link } from "react-router-dom";

const Navbar = () => {
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
          {/* Cart Icon */}
          <Link
            to="/cart"
            className="flex items-center text-white bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            <FaCartPlus className="mr-2" />
          </Link>

          {/* Profile Icon */}
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
                d="M12 14c4 0 6-4 6-6s-2-6-6-6-6 4-6 6 2 6 6 6zM12 14c2.5 0 4-2 4-4s-1.5-4-4-4-4 2-4 4 1.5 4 4 4z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 14c-4 0-6 1-6 3v1h12v-1c0-2-2-3-6-3z"
              />
            </svg>
          </button>
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
