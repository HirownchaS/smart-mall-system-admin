import { useState, useEffect, useRef } from 'react';
import Button from '@mui/material/Button';
import { Link, useNavigate } from 'react-router-dom';
import { GridComponent, Inject, ColumnsDirective, ColumnDirective, Search, Page, Toolbar } from '@syncfusion/ej2-react-grids'; // Include Toolbar
import { Header } from '../components';
import Swal from 'sweetalert2'
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Advertisements = () => {
  const [adData, setAdData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const gridRef = useRef(null);
  const navigate = useNavigate();

  const toolbarOptions = ['Search']; // Toolbar options including Search
  const editing = { allowDeleting: true, allowEditing: true };

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/ads');
        const data = await response.json();
        setAdData(data);
        console.log(adData)
        const fieldsToDisplay = ['adNo', 'title', 'description', 'createdAt'];
        const cols = fieldsToDisplay.map((key) => ({
          field: key,
          headerText: key.charAt(0).toUpperCase() + key.slice(1),
          width: '150',
          textAlign: 'Center',
        }));
        // console.log(cols)

        setColumns(cols);
      } catch (error) {
        console.error('Error fetching Advertisements:', error);
      }
    };
    

    fetchAds();
  }, []);

  
  const deleteAd = async (id) => {
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
          const response = await fetch(`http://localhost:8080/api/ads/advertisement/${id}`, {
            method: 'DELETE',
          });
      
          if (response.ok) {
            // If the advertisement is deleted successfully
            console.log("Advertisement deleted successfully");
            // Show success message
            Swal.fire({
              title: "Deleted!",
              text: "Your file has been deleted.",
              icon: "success"
            });
            // Navigate or refresh the advertisement list
            window.location.reload();// Assuming you want to go back to the list page
          } else {
            const result = await response.json();
            console.error('Error:', result.message);
            Swal.fire({
              title: "Error!",
              text: result.message || "An error occurred while deleting the advertisement.",
              icon: "error"
            });
          }
        } catch (error) {
          console.error('Error:', error);
          Swal.fire({
            title: "Error!",
            text: "An error occurred while deleting the advertisement.",
            icon: "error"
          });
        }
      }
    });
  };

  const editAdvertisement = (id) => {
    navigate(`/modifyAdvertisement/${id}`);
  };
  
  
  const actionTemplate = (rowData) => {
    return (
      <div className="flex justify-center gap-2">
        <Button
          variant="contained"
          color="primary"
          onClick={() => editAdvertisement(rowData._id)}
        >
          Edit
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => deleteAd(rowData._id)}
          style={{ backgroundColor: 'red' }}
        >
          Delete
        </Button>
      </div>
    );
  };
  
  // const deleteAd = async (adNo) => {
  //   try {
  //     const response = await fetch(`http://localhost:8080/api/ads/${adNo}`, {
  //       method: 'DELETE',
  //     });
  //     if (response.ok) {
  //       setAdData(adData.filter((ad) => ad.adNo !== adNo));
  //       console.log(`Advertisement ${adNo} deleted successfully`);
  //     } else {
  //       console.error(`Failed to delete advertisement ${adNo}`);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting advertisement:', error);
  //   }
  // };

  const handleDataBound = () => {
    if (gridRef.current) {
      const filteredRecords = gridRef.current.getCurrentViewRecords();
      setFilteredData(filteredRecords);
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Advertisements Report', 14, 10);
    doc.autoTable({
      head: [columns.map(col => col.headerText)],
      body: filteredData.map(ads => columns.map(col => ads[col.field])),
    });
    doc.save('ad_report.pdf');
  };

  return (
    <div className="m-2 md:m-10 mt-10 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
        <Header category="Mall" title="Advertisements" />
        <div>
          <Button variant="contained" color="primary" style={{ marginRight: '10px' }}>
            <Link to="/addAdvertisement" style={{ color: 'inherit', textDecoration: 'none' }}>Add Advertisement</Link>
          </Button>
          <Button variant="contained" color="secondary" onClick={generatePDF}>
            Generate Report
          </Button>
        </div>
      </div>
      {adData.length > 0 && columns.length > 0 ? (
      <GridComponent
        dataSource={adData}
        width="auto"
        allowPaging
        allowSorting
        pageSettings={{ pageCount: 5 }}
        editSettings={editing}
        toolbar={toolbarOptions}
        ref={gridRef}
        dataBound={handleDataBound}
      >
        <ColumnsDirective>
          {columns.map((col, index) => (
            <ColumnDirective key={index} {...col} />
          ))}
            <ColumnDirective
              headerText="Actions"
              template={actionTemplate}
              width="180"
              textAlign="Center"
            />
        </ColumnsDirective>
        <Inject services={[Search, Page, Toolbar]} /> {/* Inject Toolbar service */}
      </GridComponent>
    ) : (
        <p>Loading advertisements data...</p>
      )}
    </div>
  );
};

export default Advertisements;
