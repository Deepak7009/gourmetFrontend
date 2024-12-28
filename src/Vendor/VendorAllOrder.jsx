import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const VendorAllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const vendorToken = localStorage.getItem("vendorToken");
        if (!vendorToken) {
          setError("Vendor not authenticated.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        };

        const response = await axios.get(`${baseUrl}vendor/vendorOrder`, config);
        
        if (response.data && response.data.length === 0) {
          setError("No orders found for this vendor.");
        } else {
          setOrders(response.data);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
        setError("Failed to fetch orders. Please try again later.");
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-600">Loading orders...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Vendor Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2">Order ID</th>
              <th className="border border-gray-200 px-4 py-2">Customer</th>
              <th className="border border-gray-200 px-4 py-2">Total Items</th>
              <th className="border border-gray-200 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50">
                  <td className="border border-gray-200 px-4 py-2">{order._id}</td>
                  <td className="border border-gray-200 px-4 py-2">
                    {order.customerCare?.name || "N/A"}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {order.totalItem || 0}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="4"
                  className="border border-gray-200 px-4 py-2 text-center text-gray-500"
                >
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VendorAllOrder;
