import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { baseUrl } from '../utils/const';
import { Link } from 'react-router-dom';

const VendorAllProducts = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const addToCart = (item) => {
        // Get the current cart from local storage
        const cart = JSON.parse(localStorage.getItem('cart')) || [];

        // Check if the item is already in the cart
        const existingItemIndex = cart.findIndex((cartItem) => cartItem._id === item._id);

        if (existingItemIndex !== -1) {
            // Update quantity if item exists
            cart[existingItemIndex].quantity += 1;
        } else {
            // Add new item to the cart
            cart.push({
                _id: item._id,
                name: item.name,
                photo: item.photo,
                quantity: 1,
            });
        }

        // Save the updated cart back to local storage
        localStorage.setItem('cart', JSON.stringify(cart));
    };


    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await axios.get(`${baseUrl}vendor/items`);
                setItems(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    if (loading) return <p className="text-center mt-10 text-xl">Loading...</p>;
    if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6 text-center">Products</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.map((item) => (
                    <div key={item._id} className="border rounded-lg shadow-lg p-4">
                        <img src={item.photo} alt={item.name} className="w-full h-40 object-cover rounded-md" />
                        <h3 className="text-lg font-semibold mt-4">{item.name}</h3>
                        <p className="text-gray-600">Price: <span className="font-bold">${item.price}</span></p>
                        <p className="text-sm text-gray-500 mt-2">{item.description}</p>
                        <button
                            onClick={() => addToCart(item)}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                        >
                            Add to Cart
                        </button>

                    </div>
                ))}
            </div>
            <Link to="/cartPage" className="mt-6 text-blue-500 hover:text-blue-600">CartPage</Link>
        </div>
    );
};

export default VendorAllProducts;
