import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const UpdateStore = () => {
  const { id } = useParams(); // Extract store ID from URL
  const [storeData, setStoreData] = useState({
    name: "",
    storeno: "",
    level: "",
    category: "",
    img: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing store details by ID
    const fetchStore = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/store/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store data");
        }
        const data = await response.json();
        setStoreData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStore();
  }, [id]);

  const handleChange = (e) => {
    setStoreData({ ...storeData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/store/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(storeData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update store");
      }

      navigate("/store"); // Redirect to stores page after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-5">Update Store</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Store Name</label>
          <input
            type="text"
            name="name"
            value={storeData.name}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Store Number</label>
          <input
            type="text"
            name="storeno"
            value={storeData.storeno}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Level</label>
          <input
            type="text"
            name="level"
            value={storeData.level}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Category</label>
          <select
            name="category"
            value={storeData.category}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
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

        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="img"
            value={storeData.img}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>


        <Button variant="contained" color="primary" type="submit">
          Update Store
        </Button>
      </form>
    </div>
  );
};

export default UpdateStore;
