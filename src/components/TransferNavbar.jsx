import React from "react";
import "../components/TransferNavbar.css";
import { LeftOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const TransferNavbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav">
          <Link to="/home">
            <div>
              <LeftOutlined />
            </div>
          </Link>
          <div>Transfer</div>
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

export default TransferNavbar;
