import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedOrderId, setExpandedOrderId] = useState(null); // Track expanded row

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const adminToken = localStorage.getItem("adminToken");
        const response = await axios.get(`${baseUrl}admin/allOrders`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setOrders(response.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const toggleExpand = (orderId) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  if (loading) {
    return <div className="text-center mt-10">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">All Orders</h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border border-gray-300 p-2">Order ID</th>
              <th className="border border-gray-300 p-2">Vendor</th>
              <th className="border border-gray-300 p-2">Order Date</th>
              <th className="border border-gray-300 p-2">Total Price</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order._id}>
                <tr
                  className="hover:bg-gray-100 cursor-pointer"
                  onClick={() => toggleExpand(order._id)}
                >
                  <td className="border border-gray-300 p-2 text-center">{order._id}</td>
                  <td className="border border-gray-300 p-2 text-center">{order.vendor?.name || "N/A"}</td>
                  <td className="border border-gray-300 p-2 text-center">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="border border-gray-300 p-2 text-center">${order.totalPrice}</td>
                </tr>
                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan="4" className="border border-gray-300 p-4">
                      <h2 className="text-lg font-bold mb-2">Order Details</h2>
                      <p><strong>Order Status:</strong> {order.orderStatus}</p>
                      <p><strong>Total Items:</strong> {order.totalItem}</p>
                      <h3 className="text-md font-bold mt-4">Items:</h3>
                      <table className="table-auto w-full border-collapse border border-gray-300 mt-2">
                        <thead>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 p-2">Product Description</th>
                            <th className="border border-gray-300 p-2">Quantity</th>
                            <th className="border border-gray-300 p-2">Price</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.orderItems.map((item) => (
                            <tr key={item._id}>
                              <td className="border border-gray-300 p-2">
                                {item.productId.description || "N/A"}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                {item.quantity}
                              </td>
                              <td className="border border-gray-300 p-2 text-center">
                                ${item.price}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllOrders;
