import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { TrashIcon, PlusIcon } from "@heroicons/react/solid";
import CircularProgress from '@mui/material/CircularProgress';
import axios from 'axios';

// Yup validation schema
const validationSchema = Yup.object().shape({
  comboPackName: Yup.string().required("Combo Pack Name is required"),
  stores: Yup.array()
    .of(
      Yup.object().shape({
        store: Yup.string().required("Store is required"),
        level: Yup.number()
          .required("Level is required")
          .positive("Level must be a positive number"),
        pricePerStore: Yup.number()
          .required("Price per store is required")
          .min(0, "Price per store must be at least 0")
          .typeError("Price per store must be a number"),
      })
    )
    .min(1, "At least one store is required"),
  offerPercentage: Yup.number()
    .required("Offer percentage is required")
    .min(0, "Offer percentage must be at least 0")
    .max(100, "Offer percentage must be at most 100"),
  price: Yup.number().positive().typeError("Price must be a number"),
});

const UpdateComboPack = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState(null);
  const [storesList, setStoresList] = useState([]);

  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm({
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stores",
  });

  const watchStores = watch("stores");
  const watchOfferPercentage = watch("offerPercentage");

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/store');
        setStoresList(response.data);
      } catch (error) {
        console.error("Error fetching stores:", error);
      }
    };

    const fetchComboPack = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/combopack/getcombopack/${id}`);
        const data = response.data;

        setValue("comboPackName", data.comboPackName);
        setValue("offerPercentage", data.offerPercentage || 0); // Set offer percentage
        setValue("price", data.price);

        const storesData = data.stores.map(store => ({
          store: store.store._id,
          level: store.level || '',
          pricePerStore: store.pricePerStore || 0,  // Set default price or leave it empty
        }));

        storesData.forEach(store => {
          append(store);
        });
      } catch (error) {
        setFetchError(error.message);
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
    fetchComboPack();
  }, [id, setValue, append]);

  const calculateTotalPrice = () => {
    const totalPricePerStore = watchStores?.reduce((sum, store) => sum + (store.pricePerStore || 0), 0);
    const discount = (watchOfferPercentage / 100) * totalPricePerStore;
    return totalPricePerStore - discount;
  };

  const handleStoreChange = (index, selectedStoreId) => {
    const selectedStore = storesList.find(store => store._id === selectedStoreId);
    const level = selectedStore ? selectedStore.level : ''; // Set default level or leave it empty
    setValue(`stores.${index}.level`, level); // Set the level based on the selected store
  };

  const onSubmit = async (formData) => {
    try {
      formData.price = calculateTotalPrice(); // Set the calculated price before submitting

      const response = await axios.put(`http://localhost:8080/api/combopack/update/${id}`, formData);
      if (response.status !== 200) throw new Error("Failed to update Combo Pack");
      navigate("/combopack");
    } catch (error) {
      console.error(error.message);
    }
  };

  if (loading) return <CircularProgress />;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="m-4 p-4 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-5">Update Combo Pack</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label className="block text-gray-700">Combo Pack Name</label>
          <input
            type="text"
            {...register("comboPackName")}
            className="border rounded w-full py-2 px-3"
          />
          {errors.comboPackName && <p className="text-red-500">{errors.comboPackName.message}</p>}
        </div>

        {/* Dynamic Stores and Levels */}
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 border p-4 rounded">
            {/* Store Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Store</label>
              <select
                {...register(`stores.${index}.store`)}
                onChange={(e) => handleStoreChange(index, e.target.value)}
                className="border rounded w-full py-2 px-3"
              >
                <option value="">Select Store</option>
                {storesList.map(store => (
                  <option key={store._id} value={store._id}>{store.name}</option>
                ))}
              </select>
              {errors.stores?.[index]?.store && (
                <p className="text-red-500">{errors.stores[index].store.message}</p>
              )}
            </div>

            {/* Level Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Level</label>
              <input
                type="number"
                {...register(`stores.${index}.level`, { valueAsNumber: true })}
                className="border rounded w-full py-2 px-3"
              />
              {errors.stores?.[index]?.level && (
                <p className="text-red-500">{errors.stores[index].level.message}</p>
              )}
            </div>

            {/* Price Per Store Field */}
            <div className="mb-4">
              <label className="block text-gray-700">Price Per Store</label>
              <input
                type="number"
                {...register(`stores.${index}.pricePerStore`, { valueAsNumber: true })}
                className="border rounded w-full py-2 px-3"
              />
              {errors.stores?.[index]?.pricePerStore && (
                <p className="text-red-500">{errors.stores[index].pricePerStore.message}</p>
              )}
            </div>

            {/* Remove Store Button */}
            <button
              type="button"
              onClick={() => remove(index)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        ))}

        {/* Button to add a new store */}
        <button
          type="button"
          onClick={() => append({ store: "", level: "" })}
          className="flex items-center bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Store
        </button>

        {/* Offer Percentage */}
        <div className="mb-4">
          <label className="block text-gray-700">Offer Percentage</label>
          <input
            type="number"
            {...register("offerPercentage", { valueAsNumber: true })}
            className="border rounded w-full py-2 px-3"
          />
          {errors.offerPercentage && <p className="text-red-500">{errors.offerPercentage.message}</p>}
        </div>

        {/* Calculated Price (Read-only) */}
        <div className="mb-4">
          <label className="block text-gray-700">Price (Calculated)</label>
          <input
            type="number"
            value={calculateTotalPrice()}
            readOnly
            className="border rounded w-full py-2 px-3 bg-gray-200"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Update Combo Pack
        </button>
      </form>
    </div>
  );
};

export default UpdateComboPack;
