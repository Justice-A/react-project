import React from "react";
import "../components/Icons.css";
import { HomeOutlined } from "@ant-design/icons";
import { BarChartOutlined } from "@ant-design/icons";
import { SwapOutlined } from "@ant-design/icons";
import { MessageOutlined } from "@ant-design/icons";
import { WalletOutlined } from "@ant-design/icons";

const Icons = () => {
  return (
    <div className="icons">
      <div className="icon-circle">
        <HomeOutlined />
      </div>
      <div className="icon-circle">
        <BarChartOutlined />
      </div>
      <div className="icon-circle">
        <SwapOutlined />
      </div>
      <div className="icon-circle">
        <MessageOutlined />
      </div>
      <div className="icon-circle">
        <WalletOutlined />
      </div>
    </div>
  );
};

export default Icons;
