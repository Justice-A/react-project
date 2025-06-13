import React from "react";
import { BellOutlined } from "@ant-design/icons";
import "../components/Navbar.css";
import { UserOutlined } from "@ant-design/icons";
const Navbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav">
          <div className="logo">
            <UserOutlined />
            Hello, Bolu
          </div>
          <div className="bell">
            <BellOutlined style={{ fontSize: "1.5em" }} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
