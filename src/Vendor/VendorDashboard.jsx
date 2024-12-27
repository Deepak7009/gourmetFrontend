import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/const';
import { FaCartPlus } from 'react-icons/fa'; // Import the cart icon

const VendorDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState({}); // State to manage the cart items

  useEffect(() => {
    // Fetch items from the API
    const fetchItems = async () => {
      try {
        const response = await axios.get(`${baseUrl}vendor/items`); // Replace with your actual API endpoint
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleAddToCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId]) {
        newCart[itemId] += 1; // Increase quantity if item already in cart
      } else {
        newCart[itemId] = 1; // Add item with quantity 1
      }
      return newCart;
    });
  };

  const handleRemoveFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      if (newCart[itemId] > 1) {
        newCart[itemId] -= 1; // Decrease quantity if more than 1
      } else {
        delete newCart[itemId]; // Remove item from cart if quantity is 1
      }
      return newCart;
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-2xl text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item._id} className="bg-white shadow-lg rounded-lg overflow-hidden">
            <img
              src={item.photo || 'https://via.placeholder.com/400'}
              alt={item.name}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{item.name}</h2>
              <p className="text-gray-600">{item.description}</p>
              <p className="mt-2 text-gray-800 font-bold">Price: ${item.price}</p>
              <p className="mt-2 text-sm text-gray-500">{item.category.companyName} - {item.category.productName}</p>
              <div className="flex justify-between items-center mt-4">
                <span
                  className={`px-3 py-1 text-xs font-semibold rounded-full ${
                    item.status === 'available' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                  }`}
                >
                  {item.status}
                </span>
                <div className="flex items-center">
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full mr-2"
                  >
                    -
                  </button>
                  <span className="text-lg font-semibold">{cart[item._id] || 0}</span>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full ml-2"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleAddToCart(item._id)}
                    className="ml-4 p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600"
                  >
                    <FaCartPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VendorDashboard;
