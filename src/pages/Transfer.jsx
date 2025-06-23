import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";

const Transfer = () => {
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    recipientAccNum: "",
    amount: "",
    pin: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recipient, setRecipient] = useState(null);

  // Verify recipient exists in Customers AND has an Account
  const verifyRecipient = async () => {
    try {
      // 1. Check Customers endpoint
      const customerResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/Customers?accountNumber=${formData.recipientAccNum}`
      );
      const customerData = await customerResponse.json();

      if (customerData.length === 0) {
        throw new Error("Recipient not found in our system");
      }

      // 2. Check Account endpoint
      const accountResponse = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account?accountNumber=${formData.recipientAccNum}`
      );
      const accountData = await accountResponse.json();

      if (accountData.length === 0) {
        throw new Error("Recipient has no active account");
      }

      setRecipient({
        ...customerData[0],
        ...accountData[0],
      });

      return true;
    } catch (err) {
      setError(err.message);
      return false;
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Verify recipient
    const isValidRecipient = await verifyRecipient();
    if (!isValidRecipient) {
      setIsLoading(false);
      return;
    }

    try {
      const transferAmount = Number(formData.amount);
      const transactionDate = new Date().toISOString();

      // Validations
      if (currentUser.balance < transferAmount) {
        throw new Error("Insufficient balance");
      }
      if (formData.pin !== currentUser.pin) {
        throw new Error("Incorrect PIN");
      }
      if (currentUser.accountNumber === formData.recipientAccNum) {
        throw new Error("Cannot transfer to yourself");
      }

      // Create transaction record
      const newTransaction = {
        amount: transferAmount,
        date: transactionDate,
        recipientName: `${recipient.firstName} ${recipient.lastName}`,
        recipientAccNum: recipient.accountNumber,
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        senderAccNum: currentUser.accountNumber,
      };

      // Update sender account
      const updatedSender = {
        ...currentUser,
        balance: currentUser.balance - transferAmount,
      };

      // Update recipient account
      const updatedRecipient = {
        ...recipient,
        balance: recipient.balance + transferAmount,
      };

      // Execute all updates
      const [transactionResponse, senderResponse, recipientResponse] =
        await Promise.all([
          // Create transaction record
          fetch(
            "https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/transactions",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(newTransaction),
            }
          ),
          // Update sender account
          fetch(
            `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${currentUser.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedSender),
            }
          ),
          // Update recipient account
          fetch(
            `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${recipient.id}`,
            {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(updatedRecipient),
            }
          ),
        ]);

      // Verify all updates succeeded
      const [transactionData, senderData, recipientData] = await Promise.all([
        transactionResponse.json(),
        senderResponse.json(),
        recipientResponse.json(),
      ]);

      // Update local state
      setCurrentUser(senderData);
      localStorage.setItem("bankUser", JSON.stringify(senderData));

      navigate("/dashboard", {
        state: {
          success: true,
          message: `Transferred ₦${transferAmount.toLocaleString()} to ${
            recipient.firstName
          }`,
          transactionId: transactionData.id,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="transfer-container">
      <h2>Transfer Funds</h2>
      {error && <div className="error">{error}</div>}

      <form onSubmit={handleTransfer}>
        <div className="form-group">
          <label>Recipient Account Number</label>
          <input
            type="text"
            value={formData.recipientAccNum}
            onChange={(e) =>
              setFormData({ ...formData, recipientAccNum: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Amount (₦)</label>
          <input
            type="number"
            min="100"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
            required
          />
        </div>

        <div className="form-group">
          <label>Your PIN</label>
          <input
            type="password"
            maxLength="4"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            required
          />
        </div>

        <button type="submit" disabled={isLoading}>
          {isLoading ? <LoadingOutlined /> : "Transfer Now"}
        </button>
      </form>

      {recipient && (
        <div className="recipient-card">
          <h4>Transferring to:</h4>
          <p>
            <strong>Name:</strong> {recipient.firstName} {recipient.lastName}
          </p>
          <p>
            <strong>Account:</strong> {recipient.accountNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default Transfer;
