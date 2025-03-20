import React, { useEffect, useState } from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { TooltipComponent } from "@syncfusion/ej2-react-popups";
import Swal from "sweetalert2";
import avatar from "../data/avatar.jpg"; // Default avatar image
import { Chat, Notification, UserProfile, Cart } from "."; // Ensure Cart is imported
import { useStateContext } from "../contexts/ContextProvider";
import { decodeJwt } from "jose"; // Make sure to install and import jwt-decode or your decode function
import Login from "./Login";

const NavButton = ({ title, customFunc, icon, color, dotColor }) => (
  <TooltipComponent content={title} position="BottomCenter">
    <button
      type="button"
      onClick={customFunc}
      style={{ color }}
      className="relative text-xl rounded-full p-3 hover:bg-light-gray"
    >
      {dotColor && (
        <span
          style={{ background: dotColor }}
          className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
        />
      )}
      {icon}
    </button>
  </TooltipComponent>
);

const Navbar = () => {
  const [user, setUserData] = useState(null); // Initialize as null or appropriate default
  const [modal, setModal] = useState(false);

  const toggleModal = () => {
    setModal(!modal);
  };

  const {
    currentColor,
    activeMenu,
    setActiveMenu,
    handleClick,
    isClicked,
    setScreenSize,
    screenSize,
  } = useStateContext();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("authtoken");
      if (token) {
        try {
          const decodedToken = decodeJwt(token); // Ensure decodeJwt is correctly implemented
          const userId = decodedToken._id; // Adjust based on your token's structure

          const response = await fetch(`http://localhost:8080/api/user/user/${userId}`);
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          const data = await response.json();
          setUserData(data);
        } catch (error) {
          console.error("Error fetching user data:", error);
          Swal.fire({
            icon: "error",
            title: "Failed to fetch user data.",
            text: error.message,
            showConfirmButton: true,
          });
        }
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize(); // Set initial screen size

    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenSize]);

  useEffect(() => {
    if (screenSize <= 900) {
      setActiveMenu(false);
    } else {
      setActiveMenu(true);
    }
  }, [screenSize, setActiveMenu]);

  const handleActiveMenu = () => setActiveMenu((prev) => !prev);

  return (
    <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
      <NavButton
        title="Menu"
        customFunc={handleActiveMenu}
        color={currentColor}
        icon={<AiOutlineMenu />}
      />
      {user ? (
      <div className="flex">
        <TooltipComponent content="Profile" position="BottomCenter">
          <div
            className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
            onClick={() => handleClick("userProfile")}
          >
            <img
              className="rounded-full w-8 h-8"
              src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} // Use default avatar if user.profile_picture is null
              alt="user-profile"
            />
            <p>
              <span className="text-gray-400 text-14">Hi,</span>{" "}
              <span className="text-gray-400 font-bold ml-1 text-14">
                {user ? user.username : "Loading..."} {/* Display "Loading..." until user data is loaded */}
              </span>
            </p>
            <MdKeyboardArrowDown className="text-gray-400 text-14" />
          </div>
        </TooltipComponent>
      

        {isClicked.cart && <Cart />}
        {isClicked.chat && <Chat />}
        {isClicked.notification && <Notification />}
        {isClicked.userProfile && <UserProfile user = {user}/>}
      </div>
      ) : (
        <button
    onClick={toggleModal}
    className="ml-4 p-1 w-20 h-10 text-white rounded"
    style={{ backgroundColor: '#7c93c3' }}
    >
    Login
    </button>
      )}
      {modal && <Login setModal={setModal} modal={modal} />}
    </div>
  
  );
};

export default Navbar;
