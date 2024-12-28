import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllCustomerCares = () => {
  const [customerCares, setCustomerCares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomerCares = async () => {
      const adminToken = localStorage.getItem("adminToken"); // Get token from localStorage

      try {
        const response = await axios.get(`${baseUrl}admin/customerCares`, {
          headers: {
            Authorization: `Bearer ${adminToken}`, // Pass token in header
          },
        });
        setCustomerCares(response.data); // Set the customerCares state with the response
      } catch (err) {
        setError("Failed to fetch customerCares");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerCares();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">All CustomerCares</h2>

      {loading ? (
        <p className="text-center text-gray-500">Loading customerCares...</p>
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
              {customerCares.map((customerCare) => (
                <tr key={customerCare._id}>
                  <td className="px-4 py-2 border-b">{customerCare.name}</td>
                  <td className="px-4 py-2 border-b">{customerCare.email}</td>
                  <td className="px-4 py-2 border-b">{customerCare.role}</td>
                  <td className="px-4 py-2 border-b">
                    {new Date(customerCare.createdAt).toLocaleDateString()}
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

export default GetAllCustomerCares;
