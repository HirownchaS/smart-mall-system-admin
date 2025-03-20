import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { Header } from '../../components';

const ComboPack = () => {
  const [comboData, setComboData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchComboPacks = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/combopack/getcombopacks');
        const data = await response.json();
        console.log(data); // Inspect the fetched data
        setComboData(data);
      } catch (error) {
        console.error('Error fetching Combo Packs:', error);
      }
    };
  
    fetchComboPacks();
  }, []);
  

  const deleteComboPack = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await fetch(`http://localhost:8080/api/combopack/delete/${id}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            Swal.fire({
              title: "Deleted!",
              text: "The combo pack has been deleted.",
              icon: "success"
            });
            setComboData(prevData => prevData.filter(combo => combo._id !== id));
          } else {
            const result = await response.json();
            Swal.fire({
              title: "Error!",
              text: result.message || "An error occurred while deleting the combo pack.",
              icon: "error"
            });
          }
        } catch (error) {
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the combo pack.",
            icon: "error"
          });
        }
      }
    });
  };

  const editComboPack = (id) => {
    navigate(`/modifyComboPack/${id}`);
  };

  return (
    <div className="m-2 md:m-10 mt-10 p-2 md:p-10 bg-white dark:bg-gray-800 rounded-3xl">
      <div className="flex justify-between items-center mb-4">
        <Header category="Mall" title="Combo Packs" />
        <Link to="/addComboPack">
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Add Combo Pack
          </button>
        </Link>
      </div>
      {comboData.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-left">
            <thead>
              <tr className="w-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                <th className="py-2 px-4 border-b">{'Combo Pack Name'}</th>
                <th className="py-2 px-4 border-b">{'Level'}</th>
                <th className="py-2 px-4 border-b">{'Price'}</th>
                <th className="py-2 px-4 border-b">{'Store Name(s)'}</th>
                <th className="py-2 px-4 border-b">{'Created At'}</th>
                <th className="py-2 px-4 border-b text-center">{'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {comboData.map(combo => (
                <tr key={combo._id} className="hover:bg-gray-100 dark:hover:bg-gray-800">
                  <td className="py-2 px-4 border-b">{combo.comboPackName}</td>
                  <td className="py-2 px-4 border-b">{combo.stores.map(store => store.level).join(', ')}</td>
                  <td className="py-2 px-4 border-b">{combo.price}</td>
                  <td className="py-2 px-4 border-b">{combo.stores.map(store => store.store?.name).join(', ')}</td>
                  <td className="py-2 px-4 border-b">{new Date(combo.createdAt).toLocaleDateString()}</td>
                  <td className="py-2 px-4 border-b text-center">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded mr-2"
                      onClick={() => editComboPack(combo._id)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                      onClick={() => deleteComboPack(combo._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-700 dark:text-gray-200">Loading combo packs data...</p>
      )}
    </div>
  );
};

export default ComboPack;
