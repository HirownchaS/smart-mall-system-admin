import React, { useEffect, useState } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';
import { Header } from '../components';

const Bookings = () => {
  const editing = { allowDeleting: true, allowEditing: true };
  const [bookings, setBookings] = useState([]);
  
  // Define columns based on the fetched booking data
  const columns = [
    { field: 'parkingSlot.slot', headerText: 'Slot', width: '150', textAlign: 'Center' },
    { field: 'user.username', headerText: 'Username', width: '150', textAlign: 'Center' },
    { field: 'carNumber', headerText: 'Vehicle Number', width: '150', textAlign: 'Center' },
    { field: 'isActive', headerText: 'Status', width: '150', textAlign: 'Center',
      template: (data) => data.isActive ? 'Active' : 'Inactive' // Conditional rendering for status
    }
  ];

  useEffect(() => {
    fetch('http://localhost:8080/api/park/bookings')
      .then((response) => response.json())
      .then((data) => {
        setBookings(data); // Set fetched bookings data to state
      });
  }, []);

  return (
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <Header category="Mall" title="Bookings" />
      <GridComponent
        id="gridcomp"
        dataSource={bookings} // Pass the bookings data to the Grid
        allowPaging
        allowSorting
        allowExcelExport
        allowPdfExport
        contextMenuItems={['PdfExport', 'ExcelExport', 'SortAscending', 'SortDescending']}
        editSettings={editing}
      >
        <ColumnsDirective>
          {columns.map((col, index) => (
            <ColumnDirective key={index} {...col} />
          ))}
        </ColumnsDirective>
        <Inject services={[Resize, Sort, ContextMenu, Filter, Page, ExcelExport, Edit, PdfExport]} />
      </GridComponent>
    </div>
  );
};

export default Bookings;
