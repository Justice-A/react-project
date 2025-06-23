import React, { useState, useContext } from "react";
import DepositNavbar from "../components/DepositNavbar";
import Input from "../components/Input";
import { LoadingOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext";

const Deposit = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    amount: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? value.replace(/[^0-9]/g, "") : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (!formData.amount || isNaN(formData.amount)) {
        throw new Error("Please enter a valid amount");
      }

      const depositAmount = Number(formData.amount);
      const newBalance = Number(currentUser.balance) + depositAmount;

      const response = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${currentUser.accountId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...currentUser,
            balance: newBalance,
          }),
        }
      );

      const updatedAccount = await response.json();

      setCurrentUser(updatedAccount);
      localStorage.setItem("bankUser", JSON.stringify(updatedAccount));

      navigate("/home", {
        state: {
          message: `Deposited ₦${depositAmount.toFixed(2)} successfully!`,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="deposit-container">
      <DepositNavbar />
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <Input
          type="number"
          name="amount"
          label="Deposit Amount:"
          value={formData.amount}
          onChange={handleChange}
          min="100"
          required
        />

        <Input
          type="password"
          name="pin"
          label="Your PIN:"
          value={formData.pin}
          onChange={handleChange}
          maxLength="4"
          pattern="\d{4}"
          required
        />

        <button type="submit" disabled={isLoading} className="deposit-button">
          {isLoading ? <LoadingOutlined /> : "Deposit"}
        </button>
      </form>
    </div>
  );
};

export default Deposit;
