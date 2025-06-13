import React from "react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import "../components/UserBalance.css";
import { EyeOutlined } from "@ant-design/icons";
import { CopyOutlined } from "@ant-design/icons";

const UserBalance = () => {
  const textToCopy = "7331437201";
  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        alert("Copied!");
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  const [showBalance, setShowBalance] = useState(true);

  const toggleBalance = () => {
    setShowBalance((prev) => !prev);
  };

  return (
    <div>
      <Navbar />
      <div className="custom-card">
        <div className="balance">
          <p className="total-balance">
            Total Balance
            <EyeOutlined onClick={toggleBalance} className="copy-icon" />
          </p>
          <b>{showBalance ? "$1000.00" : "****"}</b>
        </div>
        <div className="account-no">
          <p>Account Number</p>
          <p>
            <CopyOutlined onClick={handleCopy} className="copy-icon" />
            7331437201
          </p>
          <p></p>
          <p>Transaction History </p>
        </div>
      </div>
    </div>
  );
};

export default UserBalance;
