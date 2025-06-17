import React from "react";

import { LeftOutlined } from "@ant-design/icons";
import { HomeOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const InvestNavbar = () => {
  return (
    <div>
      <nav className="navbar">
        <div className="nav">
          <Link to="/home">
            <div>
              <LeftOutlined />
            </div>
          </Link>
          <div>Invest</div>
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
export default InvestNavbar;
