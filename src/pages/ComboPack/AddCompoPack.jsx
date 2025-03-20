import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import axios from 'axios';
import { TrashIcon } from "@heroicons/react/solid";

// Yup validation schema
const validationSchema = Yup.object().shape({
  comboPackName: Yup.string().required('Combo pack name is required'),
  stores: Yup.array().of(
    Yup.object().shape({
      store: Yup.string().required('Store is required'),
      level: Yup.string().required('Level is required'),
      pricePerStore: Yup.number()
        .typeError('Price per store must be a number')
        .min(0, 'Price per store must be at least 0')
        .required('Price per store is required'),
    })
  ),
  offerPercentage: Yup.number()
    .typeError('Offer percentage must be a number')
    .min(0, 'Offer percentage must be at least 0')
    .max(100, 'Offer percentage must be at most 100')
    .required('Offer percentage is required'),
});

const AddCompoPack = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [stores, setStores] = useState([]);

  const {
    register,
    control,
    handleSubmit,
    setValue, 
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'stores',
  });

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/store');
        setStores(response.data);
      } catch (error) {
        console.error('Error fetching stores:', error);
      }
    };

    fetchStores();
  }, []);

  const onSubmit = async (data) => {
    try {
      const response = await axios.post('http://localhost:8080/api/combopack/create', data);
      if (response.status === 201) {
        setMessage('Combo Pack added successfully!');
        setTimeout(() => {
          navigate('/combopack');
        }, 1000);
      } else {
        setMessage('Error adding combo pack');
      }
    } catch (error) {
      setMessage('Failed to add combo pack. Please try again.');
    }
  };

  const handleStoreChange = (index, selectedStoreId) => {
    const selectedStore = stores.find(store => store._id === selectedStoreId);
    if (selectedStore) {
      setValue(`stores.${index}.level`, selectedStore.level);
    }
  };

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Add a Combo Pack</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Combo Pack Name</label>
          <input
            type="text"
            {...register('comboPackName')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.comboPackName && <p className="text-red-600">{errors.comboPackName.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Stores</label>
          {fields.map((item, index) => (
            <div key={item.id} className="mb-4 border p-2 rounded">
              <div className="flex space-x-4">
                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">Store</label>
                  <select
                    {...register(`stores.${index}.store`)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                    onChange={(e) => handleStoreChange(index, e.target.value)}
                  >
                    <option value="">Select store</option>
                    {stores.map(store => (
                      <option key={store._id} value={store._id}>{store.name}</option>
                    ))}
                  </select>
                  {errors.stores?.[index]?.store && (
                    <p className="text-red-600">{errors.stores[index].store.message}</p>
                  )}
                </div>

                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">Level</label>
                  <input
                    type="text"
                    {...register(`stores.${index}.level`)}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  {errors.stores?.[index]?.level && (
                    <p className="text-red-600">{errors.stores[index].level.message}</p>
                  )}
                </div>

                <div className="w-1/3">
                  <label className="block text-sm font-medium text-gray-700">Price Per Store</label>
                  <input
                    type="number"
                    {...register(`stores.${index}.pricePerStore`)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
                  />
                  {errors.stores?.[index]?.pricePerStore && (
                    <p className="text-red-600">{errors.stores[index].pricePerStore.message}</p>
                  )}
                </div>
              </div>
              <button
                type="button"
                onClick={() => remove(index)}
                className="mt-2 text-red-500"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={() => append({ store: '', level: '' })}
            className="mt-2 inline-flex justify-center py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Add Store
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Offer Percentage</label>
          <input
            type="number"
            {...register('offerPercentage')}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
          {errors.offerPercentage && <p className="text-red-600">{errors.offerPercentage.message}</p>}
        </div>

        <div>
          <button
            type="submit"
            className="w-full py-2 px-4 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Add Combo Pack
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

export default AddCompoPack;
