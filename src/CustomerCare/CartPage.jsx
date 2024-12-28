import React, { useEffect, useState } from 'react';

const CartPage = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(storedCart);
  }, []);

  const updateQuantity = (itemId, quantity) => {
    const updatedCart = cart.map((item) =>
      item._id === itemId ? { ...item, quantity } : item
    );
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeFromCart = (itemId) => {
    const updatedCart = cart.filter((item) => item._id !== itemId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart');
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Your Cart</h1>
      {cart.length === 0 ? (
        <p className="text-center text-lg text-gray-600">Your cart is empty</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item._id}
              className="border rounded-lg shadow-lg p-4 mb-4 flex items-center gap-4"
            >
              <img
                src={item.photo}
                alt={item.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{item.name}</h3>
                <p className="text-gray-600">ID: {item._id}</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  className="w-16 border rounded-md px-2 py-1"
                  onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                />
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
          <button
            onClick={clearCart}
            className="bg-gray-800 text-white px-6 py-3 rounded-md mt-4 hover:bg-gray-900"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
