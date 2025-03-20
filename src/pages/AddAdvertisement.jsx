import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdvertisementAdd = () => {
  const [adData, setAdData] = useState({
    title: '',
    description: '',
    image: '',
    link: '',
  });

  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdData({
      ...adData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:8080/api/ads/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(adData),
      });
      const result = await response.json();
      if (response.ok) {
        setMessage('Ad added successfully!');
        setAdData({ title: '', description: '' }); // Clear form
        setTimeout(() => {
          navigate('/advertisements'); // Redirect to /advertisements after successful addition
        }, 1000);
      } else {
        setMessage(result.message || 'Error adding advertisement');
      }
    } catch (error) {
      setMessage('Failed to add advertisements. Please try again.');
    }
  };

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add an Advertisement</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Advertisement Title
          </label>
          <input
            type="text"
            name="title"
            value={adData.title}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Advertisement Description
          </label>
          <input
            type="text"
            name="description"
            value={adData.description}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Image to Display
          </label>
          <input
            type="text"
            name="image"
            value={adData.image}
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
            Add Advertisement
          </button>
        </div>
      </form>

      {message && (
        <div className={`mt-4 text-sm ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default AdvertisementAdd;
