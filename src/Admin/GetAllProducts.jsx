import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
    quantity: "",
    status: "available",
    image: null,
  });

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

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      category: product.category?.companyName || "",
      price: product.price,
      description: product.description,
      quantity: product.quantity,
      status: product.status,
      image: null,
    });
    setModalOpen(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const adminToken = localStorage.getItem("adminToken");

    if (!adminToken) {
      setError("Admin token not found. Please log in again.");
      return;
    }

    const updatedProduct = new FormData();
    updatedProduct.append("name", formData.name);
    updatedProduct.append("category", formData.category);
    updatedProduct.append("price", formData.price);
    updatedProduct.append("description", formData.description);
    updatedProduct.append("quantity", formData.quantity);
    updatedProduct.append("status", formData.status);
    if (formData.image) {
      updatedProduct.append("image", formData.image);
    }

    try {
      const response = await axios.put(
        `${baseUrl}admin/item?id=${selectedProduct._id}`,
        updatedProduct,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      // Update the product list with the updated product
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === selectedProduct._id ? response.data : product
        )
      );
      setModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

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
              <th className="py-3 px-4 text-left font-semibold text-gray-600">Category</th>
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
                <td className="py-3 px-4">${product.price}</td>
                <td className="py-3 px-4">{product.quantity}</td>
                <td className={`py-3 px-4 ${product.status === "available" ? "text-green-500" : "text-red-500"}`}>
                  {product.status}
                </td>
                <td className="py-3 px-4">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700">Product Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                ></textarea>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  <option value="available">Available</option>
                  <option value="soldout">Sold Out</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Upload Image (Optional)</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="w-full p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllProduct;
