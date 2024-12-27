import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  const handleChangeQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        alert("Quantity cannot be less than 1.");
        return;
      }

      const vendorToken = localStorage.getItem("vendorToken");
      const config = {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      };

      const response = await axios.post(
        `${baseUrl}vendor/updateCartItem`,
        { cartItemId, quantity },
        config
      );

      setCartData(response.data); // Update the cart with the latest data
    } catch (err) {
      console.error("Failed to update cart item:", err.message);
    }
  };

  const handleRemoveItem = async (cartItemId) => {
    try {
      const vendorToken = localStorage.getItem("vendorToken");
      const config = {
        headers: {
          Authorization: `Bearer ${vendorToken}`,
        },
      };

      await axios.post(
        `${baseUrl}vendor/removeCartItem`, // Add a route for removing items
        { cartItemId },
        config
      );

      fetchCart(); // Refresh the cart after removing the item
    } catch (err) {
      console.error("Failed to remove cart item:", err.message);
    }
  };

  useEffect(() => {
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
                    {cartItem.item?.name}
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
                  <div className="flex space-x-2 mt-2">
                    <button
                      onClick={() =>
                        handleChangeQuantity(cartItem._id, cartItem.quantity - 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      -
                    </button>
                    <span className="px-4 py-1">{cartItem.quantity}</span>
                    <button
                      onClick={() =>
                        handleChangeQuantity(cartItem._id, cartItem.quantity + 1)
                      }
                      className="px-2 py-1 bg-gray-200 rounded"
                    >
                      +
                    </button>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(cartItem._id)}
                    className="mt-4 text-red-500 underline"
                  >
                    Remove
                  </button>
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
