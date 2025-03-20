import React from "react";
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Selection,
  Inject,
  Edit,
  Toolbar,
  Sort,
  Filter,
} from "@syncfusion/ej2-react-grids";

import { customersData, customersGrid } from "../data/dummy";
import { Header } from "../components";
import Button from "@mui/material/Button";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import jsPDF from "jspdf";

const Customers = () => {
  const [users, setUsers] = useState([]);
  const toolbarOptions = ["Search"];
  const [columns, setColumns] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const gridRef = useRef(null);

  useEffect(() => {
    fetch("http://localhost:8080/api/user")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        const fieldsToDisplay = ["username", "email", "date"];
        const cols = fieldsToDisplay.map((key) => ({
          field: key,
          headerText: key.charAt(0).toUpperCase() + key.slice(1),
          width: "150",
          textAlign: "left",
        }));

        setColumns(cols);
      });
  });

  const handleDataBound = () => {
    if (gridRef.current) {
      const filteredRecords = gridRef.current.getCurrentViewRecords();
      if (filteredRecords) {
        setFilteredData(filteredRecords);
      }
    }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("User Report", 14, 10);
    doc.autoTable({
      head: [columns.map((col) => col.headerText)],
      body: filteredData.map((store) => columns.map((col) => store[col.field])),
    });
    doc.save("user_report.pdf");
  };

  return (
    
    <div className="m-2 md:m-10 mt-24 p-2 md:p-10 bg-white rounded-3xl">
      <div className="flex justify-between items-center">
      <Header category="Mall" title="Users" />
        <div>
          <Button variant="contained" color="secondary" onClick={generatePDF}>
            Generate Report
          </Button>
        </div>
      </div>
      <GridComponent
        dataSource={users}
        enableHover={false}
        allowPaging
        pageSettings={{ pageCount: 5 }}
        allowSorting
        toolbar={toolbarOptions}
        ref={gridRef}
        dataBound={handleDataBound}
      >
        <ColumnsDirective>
          {/* eslint-disable-next-line react/jsx-props-no-spreading */}
          {customersGrid.map((item, index) => (
            <ColumnDirective key={index} {...item} />
          ))}
        </ColumnsDirective>
        <Inject services={[Page, Selection, Toolbar, Edit, Sort, Filter]} />
      </GridComponent>
    </div>
  );
};

export default Customers;
