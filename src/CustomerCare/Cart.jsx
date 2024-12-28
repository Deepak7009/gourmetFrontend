import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseUrl } from "../utils/const";

const Cart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // Manage modal visibility
  const [orderDetails, setOrderDetails] = useState(null); // Store cart details for the modal

  const fetchCart = async () => {
    try {
      const customerCareToken = localStorage.getItem("customerCareToken");
      if (!customerCareToken) {
        setError("CustomerCare token not found. Please login.");
        setLoading(false);
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${customerCareToken}`,
        },
      };

      const response = await axios.get(`${baseUrl}customerCare/getCart`, config);
      setCartData(response.data);
    } catch (err) {
      setError("Failed to fetch cart. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = () => {
    if (!cartData) {
      alert("No items in the cart.");
      return;
    }

    setOrderDetails({
      totalItem: cartData.totalItem,
      totalPrice: cartData.totalPrice,
      cartItems: cartData.cartItems
    });
    setIsModalOpen(true); // Open the modal
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setOrderDetails(null); // Clear the order details when closing the modal
  };

  const placeOrder = async () => {
    try {
      const customerCareToken = localStorage.getItem("customerCareToken");
      if (!customerCareToken) {
        alert("Please login to place an order.");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${customerCareToken}`,
        },
      };

      const response = await axios.post(
        `${baseUrl}customerCare/createOrder`, 
        {},
        config
      );

      alert("Order placed successfully!");
      setCartData(null); // Clear the cart after successful order
      closeModal(); // Close the modal
    } catch (err) {
      console.error("Failed to place order:", err.message);
      alert("Order failed. Please try again.");
    }
  };

  const handleChangeQuantity = async (cartItemId, quantity) => {
    try {
      if (quantity < 1) {
        alert("Quantity cannot be less than 1.");
        return;
      }

      const customerCareToken = localStorage.getItem("customerCareToken");
      const config = {
        headers: {
          Authorization: `Bearer ${customerCareToken}`,
        },
      };

      const response = await axios.post(
        `${baseUrl}customerCare/updateCartItem`,
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
      const customerCareToken = localStorage.getItem("customerCareToken");
      const config = {
        headers: {
          Authorization: `Bearer ${customerCareToken}`,
        },
      };

      await axios.post(
        `${baseUrl}customerCare/removeCartItem`,
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
            <button
              onClick={handleCheckout}
              className="mt-4 md:mt-0 px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600"
            >
              Checkout
            </button>
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
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
            <p>Total Items: {orderDetails.totalItem}</p>
            <p>Total Price: ₹{orderDetails.totalPrice}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold">Items:</h3>
              <ul>
                {orderDetails.cartItems.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <span>{item.item?.name}</span>
                    <span>Qty: {item.quantity}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={placeOrder}
                className="px-6 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600"
              >
                Place Order
              </button>
              <button
                onClick={closeModal}
                className="ml-4 px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
