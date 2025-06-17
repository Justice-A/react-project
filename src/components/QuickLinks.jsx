import React from "react";
import "../components/QuickLinks.css";
import { Link } from "react-router-dom";
import { SwapOutlined } from "@ant-design/icons";
import { WalletOutlined } from "@ant-design/icons";
import { BarChartOutlined } from "@ant-design/icons";
import { LineChartOutlined } from "@ant-design/icons";
import { GlobalOutlined } from "@ant-design/icons";
import { BulbOutlined } from "@ant-design/icons";
import { SafetyCertificateOutlined } from "@ant-design/icons";
import { InfoOutlined } from "@ant-design/icons";

const QuickLinks = () => {
  return (
    <div className="card">
      <h3 className="links-heading">Quick Links</h3>
      <div className="cards">
        <Link to="/transfer">
          <div className="card-item">
            <SwapOutlined />
            Transfer
          </div>
        </Link>
        <Link to="/bill">
          <div className="card-item">
            <WalletOutlined />
            Bills
          </div>
        </Link>
        <Link to="/top-up">
          <div className="card-item">
            <BarChartOutlined />
            Topup
          </div>
        </Link>
        <Link to="/invest">
          <div className="card-item">
            <LineChartOutlined />
            Invest
          </div>
        </Link>
        <div className="card-item">
          <GlobalOutlined />
          Betting
        </div>
        <div className="card-item">
          <BulbOutlined />
          Shop
        </div>
        <div className="card-item">
          <SafetyCertificateOutlined />
          Deals
        </div>
        <div className="card-item">
          <InfoOutlined />
          Others
        </div>
      </div>
    </div>
  );
};

export default QuickLinks;
