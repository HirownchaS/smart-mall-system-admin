import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

const ModifyAdvertisement = () => {
  const { id } = useParams(); // Extract store ID from URL
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch the existing store details by ID
    const fetchAdvertisement = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/ads/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch store data");
        }
        const data = await response.json();
        setAdData(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAdvertisement();
  }, [id]);

  const handleChange = (e) => {
    setAdData({ ...adData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/api/ads/modify/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(adData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update store");
      }

      navigate("/advertisements"); // Redirect to stores page after successful update
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-5">Update Advertisement</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">Advertisement Title</label>
          <input
            type="text"
            name="title"
            value={adData.title}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">description</label>
          <input
            type="text"
            name="description"
            value={adData.description}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Image URL</label>
          <input
            type="text"
            name="image"
            value={adData.image}
            onChange={handleChange}
            className="border rounded w-full py-2 px-3"
            required
          />
        </div>

        <Button variant="contained" color="primary" type="submit">
          Update Advertisement
        </Button>
      </form>
    </div>
  );
};

export default ModifyAdvertisement;
