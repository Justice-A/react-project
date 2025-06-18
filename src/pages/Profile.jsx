import React from "react";
import { useNavigate } from "react-router-dom"; // Add this import
import { useAuthContext } from "../AuthContext"; // Add this import
import ProfileNavbar from "../components/ProfileNavbar";
import { UserOutlined, RightOutlined, LogoutOutlined } from "@ant-design/icons";
import "./profile.css";

const Profile = () => {
  const { logout } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div>
      <ProfileNavbar />

      <main className="profile-container">
        <section className="profile-card">
          <div className="profile-header">
            <div className="avatar">
              <UserOutlined />
            </div>
            <div className="profile-info">
              <h2>BOLU AREGBESOLA</h2>
              <button className="bvn-button">View my BVN</button>
            </div>
          </div>
        </section>

        <section className="menu-section">
          <div className="menu-item">
            <span>Analytics</span>
            <RightOutlined />
          </div>
          <div className="menu-item">
            <span>PIN & Password</span>
            <RightOutlined />
          </div>
          <div className="menu-item">
            <span>Account rules and policies</span>
            <RightOutlined />
          </div>
          <div className="menu-item">
            <span>SIGN OUT</span>
            <button onClick={handleLogout}>
              <LogoutOutlined />
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
