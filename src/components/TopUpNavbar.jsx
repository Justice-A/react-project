import React from "react";
import "./TopUpNavbar.css";
import { LeftOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const TopUpNavbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav">
          <Link to="/home">
            <div>
              <LeftOutlined />
            </div>
          </Link>
          <div>TopUp</div>
          <Link to="/home">
            <div>
              <HomeOutlined />
            </div>
          </Link>
        </div>
      </nav>
    </div>
  );
};
export default TopUpNavbar;
