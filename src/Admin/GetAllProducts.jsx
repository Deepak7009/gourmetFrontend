// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseUrl } from "../utils/const";

// const GetAllProduct = () => {
//   const [products, setProducts] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchProducts = async () => {
//       const adminToken = localStorage.getItem("adminToken");

//       if (!adminToken) {
//         setError("Admin token not found. Please log in again.");
//         setLoading(false);
//         return;
//       }

//       try {
//         const response = await axios.get(`${baseUrl}admin/items`, {
//           headers: {
//             Authorization: `Bearer ${adminToken}`,
//           },
//         });
//         setProducts(response.data);
//         setLoading(false);
//       } catch (err) {
//         setError(err.response?.data?.error || "Something went wrong.");
//         setLoading(false);
//       }
//     };

//     fetchProducts();
//   }, []);

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-lg font-bold">Loading...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <p className="text-red-500 text-lg">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">All Products</h1>
//       <div className="overflow-x-auto">
//         <table className="min-w-full bg-white border border-gray-200 rounded-lg">
//           <thead>
//             <tr className="bg-gray-200">
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">#</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Name</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Company Name</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Product Name</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Price</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Quantity</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Status</th>
//               <th className="py-3 px-4 text-left font-semibold text-gray-600">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {products.map((product, index) => (
//               <tr key={product._id} className="border-b">
//                 <td className="py-3 px-4">{index + 1}</td>
//                 <td className="py-3 px-4">{product.name}</td>
//                 <td className="py-3 px-4">{product.category?.companyName || "N/A"}</td>
//                 <td className="py-3 px-4">{product.category?.productName || "N/A"}</td>
//                 <td className="py-3 px-4">${product.price}</td>
//                 <td className="py-3 px-4">{product.quantity}</td>
//                 <td className={`py-3 px-4 ${product.status === "available" ? "text-green-500" : "text-red-500"}`}>
//                   {product.status}
//                 </td>
//                 <td className="py-3 px-4">
//                   <button className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 focus:outline-none">
//                     Edit
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default GetAllProduct;


import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const GetAllProduct = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    category: { companyName: "", productName: "" },
    price: "",
    quantity: "",
    status: "",
    description: "",
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
      category: product.category,
      price: product.price,
      quantity: product.quantity,
      status: product.status,
      description: product.description,
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name.includes("category.")) {
      const categoryField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        category: {
          ...prev.category,
          [categoryField]: value,
        },
      }));
    } else if (name === "image") {
      setFormData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };


  const handleUpdate = async () => {
    const adminToken = localStorage.getItem("adminToken");
    if (!adminToken) {
      alert("Admin token not found. Please log in again.");
      return;
    }


    try {
      await axios.put(
        `${baseUrl}admin/update-item?itemId=${selectedProduct._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Item updated successfully!");
      setShowModal(false);
      setProducts((prev) =>
        prev.map((product) =>
          product._id === selectedProduct._id
            ? { ...product, ...formData, photo: selectedProduct.photo }
            : product
        )
      );
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to update item.");
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
              <th className="py-3 px-4 text-left font-semibold text-gray-600">company Name</th>
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
                <td className="py-3 px-4">{product.category.companyName || "N/A"}</td>
                <td className="py-3 px-4">{product.category.productName || "N/A"}</td>
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

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
            <h2 className="text-lg font-bold mb-4">Edit Product</h2>
            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Company Name</label>
                <input
                  type="text"
                  name="category.companyName"
                  value={formData.category.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Product Name</label>
                <input
                  type="text"
                  name="category.productName"
                  value={formData.category.productName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Status</label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                >
                  <option value="available">Available</option>
                  <option value="soldout">Sold Out</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium">Image</label>
                <input
                  type="file"
                  name="image"
                  onChange={handleChange}
                  className="w-full px-3 py-2 border rounded"
                />
              </div>
            </form>
            <div className="flex justify-end">
              <button
                onClick={() => setShowModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded mr-2 hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GetAllProduct;
