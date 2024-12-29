import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const VendorAllOrder = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null); // State to track the expanded order

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

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder((prevExpandedOrder) =>
      prevExpandedOrder === orderId ? null : orderId
    );
  };

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
              <th className="border border-gray-200 px-4 py-2">Order Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.length > 0 ? (
              orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr
                    onClick={() => toggleOrderDetails(order._id)}
                    className="cursor-pointer hover:bg-gray-50"
                  >
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
                    <td className="border border-gray-200 px-4 py-2">
                      {order.orderStatus}
                    </td>
                  </tr>

                  {/* Nested Table for Order Items (visible if expanded) */}
                  {expandedOrder === order._id && (
                    <tr>
                      <td colSpan="5" className="border border-gray-200 px-4 py-2">
                        <div className="overflow-x-auto">
                          <table className="table-auto w-full mt-2 border-collapse border border-gray-200">
                            <thead>
                              <tr className="bg-gray-100">
                                <th className="border border-gray-200 px-4 py-2">
                                  Product Name
                                </th>
                                <th className="border border-gray-200 px-4 py-2">Quantity</th>
                                <th className="border border-gray-200 px-4 py-2">
                                  Customer Care
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {order.orderItems.map((item) => (
                                <tr key={item._id} className="hover:bg-gray-50">
                                  <td className="border border-gray-200 px-4 py-2">
                                    {item.productId?.name || "N/A"}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2">
                                    {item.quantity}
                                  </td>
                                  <td className="border border-gray-200 px-4 py-2">
                                    {item.userId?.name || "N/A"}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
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
