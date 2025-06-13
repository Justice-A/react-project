import React from "react";
import "../pages/Transfer.css";
import TransferNavbar from "../components/TransferNavbar";
import Input from "../components/Input";

const Transfer = () => {
  return (
    <div>
      <TransferNavbar />
      <Input type="text" label="Select Bank:" />
      <Input type="number" label="Account Number:" />
      <Input type="number" label="Amount:" />
      <Input type="text" label="Remark:" />
    </div>
  );
};

export default Transfer;
