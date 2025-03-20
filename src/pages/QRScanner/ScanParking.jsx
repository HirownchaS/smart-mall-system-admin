import React, { useEffect, useState, useCallback } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import axios from "axios";
import Swal from "sweetalert2";
import moment from "moment-timezone";

const API_BASE_URL = "http://localhost:8080/api";

const ScanParking = () => {
  const [scanResult, setScanResult] = useState("");
  const [booking, setBooking] = useState(null);
  const [bill, setBill] = useState(null);

  const showAlert = useCallback((icon, title, text = "") => {
    Swal.fire({ icon, title, text, showConfirmButton: true });
  }, []);

  const getAdjustedTime = useCallback(() => {
    return moment
      .tz(new Date(), "Asia/Colombo")
      // .add(1, "hours")
      // .add(30, "minutes")
      .toISOString();
  }, []);

  const getAdjustedTimee = useCallback(() => {
    return moment.tz(new Date(), "Asia/Colombo").toISOString();
  }, []);

  const fetchBookingDetails = useCallback(
    async (bookingId) => {
      try {
        const { data } = await axios.get(`${API_BASE_URL}/park/${bookingId}`);
        setBooking(data);
      } catch (err) {
        console.error("Error fetching booking details:", err);
        showAlert(
          "error",
          err.response?.data?.message || "Error fetching booking details"
        );
      }
    },
    [showAlert]
  );

  const updateBookingStatus = useCallback(async () => {
    if (!booking || !booking.parkingSlot) {
      showAlert(
        "error",
        "Error",
        "Booking or parking slot information is missing."
      );
      return;
    }

    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/park/disable/${booking._id}`,
        {
          time: getAdjustedTime(),
        }
      );

      console.log("Bill data:", data);

      setBill({
        userName: booking.user.username,
        arrivalTime: data.arrivalTime,
        departureTime: data.departureTime,
        amount: data.totalCost,
      });

      const emailBody = {
        subject: "Booking Disabled",
        html: `
          <h2 style="color: #f54242;">Booking Disabled</h2>
          <p>Your booking for <strong>Slot ${booking.parkingSlot.slot}</strong> has been disabled.</p>
          <p>Amount to be paid: <strong>Rs. ${data.totalCost}</strong></p>
          <p>Thank you for using our service.</p>
          <p style="font-style: italic; color: #888;">Smart Parking Service Team</p>
        `,
      };

      await axios.post(`${API_BASE_URL}/mail/${booking.user._id}`, emailBody);
      showAlert("success", data.message);
    } catch (err) {
      console.error("Error updating booking status:", err);
      showAlert("error", "Error", "Failed to update booking status");
    }
  }, [booking, getAdjustedTime, showAlert]);

  const updateArrivalTime = useCallback(async () => {
    try {
      const adjustedTime = getAdjustedTimee();
      const { data } = await axios.put(
        `${API_BASE_URL}/park/time/${booking._id}`,
        {
          time: adjustedTime,
        }
      );

      showAlert("success", "Entry registered Successfully");
    } catch (err) {
      console.error("Error updating arrival time:", err);
      showAlert("error", "Error", "Failed to update arrival time");
    }
  }, [booking, getAdjustedTime, showAlert]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner("reader", {
      qrbox: { width: 500, height: 500 },
      fps: 10,
    });

    scanner.render(
      (result) => {
        console.log("QR Scan success:", result);
        setScanResult(result);
        scanner.clear();
      },
      (err) => console.warn(`Scan error: ${err}`)
    );

    return () => scanner.clear();
  }, []);

  useEffect(() => {
    if (scanResult) {
      fetchBookingDetails(scanResult);
    }
  }, [scanResult, fetchBookingDetails]);

  const BillComponent = ({ bill }) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md mt-4">
      <h3 className="text-xl font-semibold mb-2">Bill Details</h3>
      <p>
        <strong>User Name:</strong> {bill.userName}
      </p>
      <p>
        <strong>Arrived Time:</strong>{" "}
        {moment(bill.arrivedTime).format("MMMM Do YYYY, h:mm:ss a")}
      </p>
      <p>
        <strong>Departure Time:</strong>{" "}
        {moment(bill.departureTime).format("MMMM Do YYYY, h:mm:ss a")}
      </p>
      <p>
        <strong>Amount to be Paid:</strong> Rs. {bill.amount}
      </p>
    </div>
  );

  return (
    <div className="m-2 md:m-10 mt-10 p-2 md:p-10 bg-white rounded-3xl">
      <h1 className="text-2xl font-bold mb-6">Scan Tickets here</h1>
      <div id="reader" className="max-h-screen"></div>

      {booking && (
        <div className="result w-96 flex border-black border-1 flex-col items-center justify-center mt-4">
          <h2 className="text-xl font-semibold mb-2">Booking Details</h2>
          <p>
            <strong>Booking ID:</strong> {booking._id}
          </p>
          <p>
            <strong>User Name:</strong> {booking.user.username}
          </p>
          <p>
            <strong>Vehicle Number:</strong> {booking.carNumber}
          </p>
          <p>
            <strong>Booked Time:</strong> {booking.bookingTime}
          </p>

          {booking.arrivalTime == null ? (
            <button
              className="bg-blue-600 mt-4 text-white rounded-md px-4 py-2"
              onClick={updateArrivalTime}
            >
              Register Entry
            </button>
          ) : (
            <button
              className="bg-red-600 mt-4 text-white rounded-md px-4 py-2"
              onClick={updateBookingStatus}
            >
              Disable Booking
            </button>
          )}
        </div>
      )}

      {bill && <BillComponent bill={bill} />}

      {!booking && !bill && (
        <p className="mt-4">No booking details available.</p>
      )}
    </div>
  );
};

export default ScanParking;
