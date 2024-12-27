import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const vendorToken = localStorage.getItem("vendorToken");
        if (!vendorToken) {
          setError("Vendor token not found. Please login.");
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        };

        const response = await axios.get(`${baseUrl}vendor/getCart`, config);
        setCartData(response.data);
      } catch (err) {
        setError("Failed to fetch cart. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
      {cartData && (
        <div className="grid gap-4">
          <div className="flex flex-col md:flex-row justify-between items-center bg-gray-100 p-4 rounded-lg">
            <div>
              <h2 className="text-lg font-semibold">
                Total Items: {cartData.totalItem}
              </h2>
              <h2 className="text-lg font-semibold">
                Total Price: ₹{cartData.totalPrice}
              </h2>
            </div>
          </div>
          {cartData.cartItems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {cartData.cartItems.map((cartItem) => (
                <div
                  key={cartItem._id}
                  className="bg-white shadow-md rounded-lg p-4"
                >
                  <h3 className="font-semibold text-lg">
                    {cartItem.item.name}
                  </h3>
                  <p className="text-sm text-gray-600">
                    Price: ₹{cartItem.price}
                  </p>
                  <p className="text-sm text-gray-600">
                    Quantity: {cartItem.quantity}
                  </p>
                  <p className="text-sm text-gray-600">
                    Subtotal: ₹{cartItem.price * cartItem.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">Your cart is empty.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Cart;
