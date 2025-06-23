import React, { useState, useEffect, useContext } from "react";
import Navbar from "./Navbar";
import "../components/UserBalance.css";
import { EyeOutlined, CopyOutlined, RightOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";
const UserBalance = () => {
  const { currentUser } = useContext(AuthContext);
  const [showBalance, setShowBalance] = useState(true);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(currentUser?.accountNumber || "")
      .then(() => alert("Copied!"))
      .catch((err) => console.error("Failed to copy: ", err));
  };

  return (
    <div>
      <Navbar />
      <div className="custom-card">
        <div className="balance">
          <p className="total-balance">
            Total Balance
            <EyeOutlined
              onClick={() => setShowBalance(!showBalance)}
              className="copy-icon"
            />
          </p>
          <b>
            {showBalance
              ? `₦${(Number(currentUser?.balance) || 0).toFixed(2)}`
              : "****"}
          </b>
        </div>
        <div className="account-no">
          <p>Account Number</p>
          <p>
            <CopyOutlined onClick={handleCopy} className="copy-icon" />
            {currentUser?.accountNumber || "Loading..."}
          </p>
          <Link to="/history">
            <p>
              Transaction History <RightOutlined />
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
