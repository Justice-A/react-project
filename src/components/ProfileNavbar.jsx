import React from "react";
import { LeftOutlined, EditOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./ProfileNavbar.css";

const ProfileNavbar = () => {
  return (
    <header className="profile-navbar">
      <div className="navbar-container">
        <Link to="/home" className="nav-button">
          <LeftOutlined />
        </Link>
        <h1 className="nav-title">Profile</h1>
        <button className="nav-button">
          <EditOutlined />
        </button>
      </div>
    </header>
  );
};

export default ProfileNavbar;
