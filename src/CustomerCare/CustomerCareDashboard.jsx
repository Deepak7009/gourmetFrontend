import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseUrl } from '../utils/const';
import { FaCartPlus } from 'react-icons/fa';

const processData = (items) => {
  const groupedData = {};

  items.forEach((item) => {
    const { category: { companyName, productName }, status } = item;

    if (status === 'available') {  // Only process available products
      if (!groupedData[companyName]) {
        groupedData[companyName] = {};
      }

      if (!groupedData[companyName][productName]) {
        groupedData[companyName][productName] = [];
      }

      groupedData[companyName][productName].push(item);
    }
  });

  return groupedData;
};

const CustomerCareDashboard = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartQuantities, setCartQuantities] = useState({}); // State to manage the quantity of each item
  const [customerCareToken, setCustomerCareToken] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      const customerCareToken = localStorage.getItem('customerCareToken');
      if (customerCareToken) {
        setCustomerCareToken(true);
      }
      try {
        const response = await axios.get(`${baseUrl}customerCare/items`); // Replace with your actual API endpoint
        setItems(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const handleQuantityChange = (itemId, change) => {
    setCartQuantities((prev) => {
      const updatedQuantities = { ...prev };
      const currentQuantity = updatedQuantities[itemId] || 0;

      if (change === -1 && currentQuantity === 0) {
        return updatedQuantities; // Prevent negative quantities
      }

      updatedQuantities[itemId] = currentQuantity + change;
      return updatedQuantities;
    });
  };

  const handleAddToCart = async (itemId) => {
    try {
      const customerCareToken = localStorage.getItem('customerCareToken');

      if (!customerCareToken) {
        alert('You are not logged in.');
        return;
      }

      const quantity = cartQuantities[itemId] || 0;
      if (quantity === 0) {
        alert('Please select a quantity before adding to the cart.');
        return;
      }

      const response = await axios.post(
        `${baseUrl}customerCare/addToCard`,
        { productId: itemId, quantity },
        {
          headers: {
            Authorization: `Bearer ${customerCareToken}`,
          },
        }
      );

      alert('Item added to cart successfully!'); // Optional success alert
    } catch (err) {
      console.error('Error adding to cart:', err.message);
      setError(err.message);
    }
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

  const groupedItems = processData(items);

  return (
    <div className="container mx-auto px-4 py-6">
      {Object.entries(groupedItems).map(([companyName, products]) => (
        <div key={companyName} className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{companyName}</h2>
          {Object.entries(products).map(([productName, productItems]) => (
            <div key={productName} className="mb-6">
              <h3 className="text-xl font-semibold mb-3">{productName}</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {productItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white shadow-lg rounded-lg overflow-hidden"
                  >
                    <img
                      src={item.photo || 'https://via.placeholder.com/400'}
                      alt={item.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {item.name}
                      </h4>
                      <p className="text-gray-600">{item.description}</p>
                      <p className="mt-2 text-gray-800 font-bold">
                        Price: ${item.price}
                      </p>
                      <div className="flex justify-between items-center mt-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${item.status === 'available'
                            ? 'bg-green-200 text-green-800'
                            : 'bg-red-200 text-red-800'
                            }`}
                        >
                          {item.status}
                        </span>
                        <div className={`${customerCareToken ? 'flex' : 'hidden'} items-center`}>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, -1)
                            }
                            className="px-2 py-1 bg-gray-300 text-gray-800 rounded-full mr-2"
                          >
                            -
                          </button>
                          <span className="text-lg font-semibold">
                            {cartQuantities[item._id] || 0}
                          </span>
                          <button
                            onClick={() =>
                              handleQuantityChange(item._id, 1)
                            }
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
          ))}
        </div>
      ))}
    </div>
  );
};

export default CustomerCareDashboard;
