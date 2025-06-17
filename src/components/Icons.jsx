import React from "react";
import "../components/Icons.css";
import { HomeOutlined } from "@ant-design/icons";
import { BarChartOutlined } from "@ant-design/icons";
import { SwapOutlined } from "@ant-design/icons";
import { MessageOutlined } from "@ant-design/icons";
import { WalletOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
const Icons = () => {
  return (
    <div className="icons">
      <Link to="/home">
        <div className="icon-circle">
          <HomeOutlined />
        </div>
      </Link>
      <Link to="/top-up">
        <div className="icon-circle">
          <BarChartOutlined />
        </div>
      </Link>
      <Link to="/transfer">
        <div className="icon-circle">
          <SwapOutlined />
        </div>
      </Link>
      <div className="icon-circle">
        <MessageOutlined />
      </div>
      <Link to="/bill">
        <div className="icon-circle">
          <WalletOutlined />
        </div>
      </Link>
    </div>
  );
};

export default Icons;
