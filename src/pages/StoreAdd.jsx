import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const StoreAdd = () => {
  const [storeData, setStoreData] = useState({
    name: "",
    level: "1", // Set a default value
    category: "",
    img: "",
    rating: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStoreData({
      ...storeData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/api/store/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(storeData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage("Store added successfully!");
        setStoreData({ name: "", level: "1", category: "" }); // Clear form
        setTimeout(() => {
          navigate("/store"); // Redirect to /store after successful addition
        }, 1000);
      } else {
        setMessage(result.message || "Error adding store");
      }
    } catch (error) {
      setMessage("Failed to add store. Please try again.");
    }
  };

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add New Store</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store Name
          </label>
          <input
            type="text"
            name="name"
            value={storeData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Level
          </label>
          <select
            name="level"
            value={storeData.level}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            name="category"
            value={storeData.category}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="" disabled>
              Select a category
            </option>
            <option value="Fashion">Fashion</option>
            <option value="Electronics">Electronics</option>
            <option value="Food and Beverage">Food and Beverage</option>
            <option value="Entertainment">Entertainment</option>
            <option value="Books and Gifts">Books and Gifts</option>
            <option value="Homeware">Homeware</option>
            <option value="Health and Wellness">Health and Wellness</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            name="img"
            value={storeData.img}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Rating
          </label>
          <input
            type="text"
            name="rating"
            value={storeData.rating}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Add Store
          </button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-4 text-sm ${
            message.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default StoreAdd;
