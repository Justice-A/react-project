import React from "react";
import { LeftOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import "./DepositNavbar.css";
const DepositNavbar = () => {
  return (
    <div>
      <div>
        <nav className="navbar">
          <div className="nav">
            <Link to="/home">
              <div>
                <LeftOutlined />
              </div>
            </Link>
            <div>Deposit</div>
            <Link to="/home">
              <div>
                <HomeOutlined />
              </div>
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
};
export default DepositNavbar;
