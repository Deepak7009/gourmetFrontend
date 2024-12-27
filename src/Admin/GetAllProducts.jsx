import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      const adminToken = localStorage.getItem("adminToken");

      if (!adminToken) {
        setError("Admin token not found. Please log in again.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${baseUrl}admin/items`, {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        });
        setProducts(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || "Something went wrong.");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg font-bold">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-500 text-lg">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">All Products</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg">
          <thead>
            <tr className="bg-gray-200">
              <th className="py-3 px-4 text-left font-semibold text-gray-600">#</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Company Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Product Name</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Price</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Quantity</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product._id} className="border-b">
                <td className="py-3 px-4">{index + 1}</td>
                <td className="py-3 px-4">{product.name}</td>
                <td className="py-3 px-4">{product.category?.companyName || "N/A"}</td>
                <td className="py-3 px-4">{product.category?.productName || "N/A"}</td>
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className={`py-3 px-4 ${product.status === "available" ? "text-green-500" : "text-red-500"}`}>
                  {product.status}
                </td>
                <td className="py-3 px-4">
                  <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default GetAllProduct;
