import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchVendors = async () => {
      const adminToken = localStorage.getItem("adminToken"); // Get token from localStorage

      try {
        const response = await axios.get(`${baseUrl}admin/vendors`, {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Pass token in header
          },
        });
        setVendors(response.data); // Set the vendors state with the response
      } catch (err) {
        setError("Failed to fetch vendors");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchVendors();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">All Vendors</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading vendors...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-2 border-b text-left">Name</th>
                <th className="px-4 py-2 border-b text-left">Email</th>
                <th className="px-4 py-2 border-b text-left">Role</th>
                <th className="px-4 py-2 border-b text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {vendors.map((vendor) => (
                <tr key={vendor._id}>
                  <td className="px-4 py-2 border-b">{vendor.name}</td>
                  <td className="px-4 py-2 border-b">{vendor.email}</td>
                  <td className="px-4 py-2 border-b">{vendor.role}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(vendor.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GetAllVendors;
