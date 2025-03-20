import React from 'react';
import { MdOutlineCancel } from 'react-icons/md';

import { Button } from '.';
import { userProfileData } from '../data/dummy';
import { useStateContext } from '../contexts/ContextProvider';
import avatar from '../data/avatar.jpg';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const UserProfile = (props) => {
  const { currentColor } = useStateContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authtoken");
    Swal.fire({
      icon: "success",
      title: "Logged out successfully.",
      showConfirmButton: true,
    });
    navigate('/');
    window.location.reload();
  };

  const user = props.user;



  return (
    <div className="nav-item absolute right-1 top-16 bg-white dark:bg-[#42464D] p-8 rounded-lg w-96">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg dark:text-gray-200">User Profile</p>
        <Button
          icon={<MdOutlineCancel />}
          color="rgb(153, 171, 180)"
          bgHoverColor="light-gray"
          size="2xl"
          borderRadius="50%"
        />
      </div>
      <div className="flex gap-5 items-center mt-6 border-color border-b-1 pb-6">
        <img
          className="rounded-full h-24 w-24"
          src={"https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
          alt="user-profile"
        />
        <div>
          <p className="font-semibold text-xl dark:text-gray-200">{user.username}</p>
          <p className="text-gray-500 text-sm dark:text-gray-400">{user.role}</p>
          <p className="text-gray-500 text-sm font-semibold dark:text-gray-400">{user.email}</p>
        </div>
      </div>
      <div className="mt-5">
        <button color="white"
          bgColor={currentColor}
          text="Logout"
          borderRadius="10px"
          width="full"
          onClick={handleLogout}> 
          Log Out
          </button>
      </div>
    </div>

  );
};

export default UserProfile;
