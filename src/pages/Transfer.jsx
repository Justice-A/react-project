import React, { useState, useContext } from "react";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import { LoadingOutlined } from "@ant-design/icons";
import TransferNavbar from "../components/TransferNavbar";
import "./Transfer.css";

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

  const validateForm = () => {
    if (!formData.recipientAccNum) {
      setError("Recipient account number is required");
      return false;
    }
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      Number(formData.amount) <= 0
    ) {
      setError("Please enter a valid amount");
      return false;
    }
    if (!formData.pin || formData.pin.length !== 4 || isNaN(formData.pin)) {
      setError("PIN must be 4 digits");
      return false;
    }
    return true;
  };
  const verifyRecipient = async () => {
    try {
      if (!formData.recipientAccNum) {
        throw new Error("Please enter recipient account number");
      }

      const response = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account?accountNumber=${formData.recipientAccNum}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recipient account");
      }

      const accountData = await response.json();

      if (!accountData || accountData.length === 0) {
        throw new Error("Account not found");
      }

      const recipientAccount = accountData[0];

      if (recipientAccount.accountNumber === currentUser?.accountNumber) {
        throw new Error("Cannot transfer to yourself");
      }

      // Extract recipient name
      let firstName, lastName;
      if (recipientAccount.recipientName) {
        [firstName, lastName] = recipientAccount.recipientName.split(" ");
      } else if (recipientAccount.name) {
        [firstName, lastName] = recipientAccount.name.split(" ");
      } else if (recipientAccount.firstName && recipientAccount.lastName) {
        firstName = recipientAccount.firstName;
        lastName = recipientAccount.lastName;
      } else {
        firstName = "Unknown";
        lastName = "User";
      }

      const recipient = {
        accountNumber: recipientAccount.accountNumber,
        email: recipientAccount.email,
        firstName,
        lastName,
        balance: recipientAccount.balance,
        pin: recipientAccount.pin,
        id: recipientAccount.id,
      };

      return recipient; // Return the recipient object instead of setting state
    } catch (err) {
      console.error("Recipient verification error:", err);
      throw err; // Re-throw the error to be caught in handleTransfer
    }
  };
  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Validate form inputs
      if (!validateForm()) {
        throw new Error("Please fix form errors");
      }

      // Check user session
      if (!currentUser) {
        throw new Error("Session expired. Please login again.");
      }

      // Parse amount
      const transferAmount = Number(formData.amount);

      // Verify recipient and get recipient data
      const verifiedRecipient = await verifyRecipient();
      if (!verifiedRecipient) {
        throw new Error("Recipient verification failed");
      }

      // Check sender balance
      if (currentUser.balance < transferAmount) {
        throw new Error("Insufficient balance");
      }

      // Verify PIN
      const senderAccountRes = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${currentUser.id}`
      );

      if (!senderAccountRes.ok) {
        throw new Error("Failed to fetch sender account");
      }

      const senderAccount = await senderAccountRes.json();

      const enteredPin = formData.pin.toString().trim();
      const storedPin = senderAccount.pin?.toString().trim();

      if (enteredPin !== storedPin) {
        throw new Error("Incorrect PIN");
      }

      // Calculate balances using verifiedRecipient
      const updatedSenderBalance = senderAccount.balance - transferAmount;
      const updatedRecipientBalance =
        verifiedRecipient.balance + transferAmount;

      // Update both accounts
      const [senderUpdateRes, recipientUpdateRes] = await Promise.all([
        fetch(
          `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${currentUser.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ balance: updatedSenderBalance }),
          }
        ),
        fetch(
          `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${verifiedRecipient.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ balance: updatedRecipientBalance }),
          }
        ),
      ]);

      if (!senderUpdateRes.ok || !recipientUpdateRes.ok) {
        throw new Error("Failed to update account balances");
      }

      // Record transaction (using verifiedRecipient)
      const transactionData = {
        amount: transferAmount,
        date: new Date().toISOString(),
        recipientName: `${verifiedRecipient.firstName} ${verifiedRecipient.lastName}`,
        recipientAccNum: verifiedRecipient.accountNumber,
        transactionRef: `TX-${Date.now()}`,
        status: "completed",
        transactionType: "transfer",
        senderName: `${currentUser.firstName} ${currentUser.lastName}`,
        senderAccNum: currentUser.accountNumber,
      };

      const transactionRes = await fetch(
        "https://68559b621789e182b37bcfe1.mockapi.io/api/v1/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(transactionData),
        }
      );

      if (!transactionRes.ok) {
        throw new Error("Failed to record transaction");
      }

      // Update local state and UI
      const updatedUser = { ...currentUser, balance: updatedSenderBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem("bankUser", JSON.stringify(updatedUser));
      setRecipient(verifiedRecipient); // Update UI with recipient info

      // Navigate to history
      navigate("/history", {
        state: {
          success: true,
          amount: transferAmount,
          recipient: `${verifiedRecipient.firstName} ${verifiedRecipient.lastName}`,
          transactionRef: transactionData.transactionRef,
        },
      });
    } catch (err) {
      setError(err.message || "Transfer failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <TransferNavbar />
      <div className="transfer-container">
        <form onSubmit={handleTransfer} className="transfer-form">
          <h2>Transfer Funds</h2>

          {error && (
            <div className="error-message">
              <span>{error}</span>
              <button
                onClick={() => setError("")}
                className="error-close"
                aria-label="Close error"
              >
                &times;
              </button>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="recipientAccNum">Recipient Account Number</label>
            <input
              id="recipientAccNum"
              name="recipientAccNum"
              type="text"
              value={formData.recipientAccNum}
              onChange={handleInputChange}
              placeholder="Enter account number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₦)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="100"
              step="100"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Minimum ₦100"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="pin">Your 4-digit PIN</label>
            <input
              id="pin"
              name="pin"
              type="password"
              maxLength="4"
              pattern="\d{4}"
              value={formData.pin}
              onChange={handleInputChange}
              placeholder="Enter your PIN"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="transfer-button"
          >
            {isLoading ? <LoadingOutlined spin /> : "Transfer Now"}
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
            <p>
              <strong>Amount:</strong> ₦
              {Number(formData.amount).toLocaleString()}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

export default Transfer;
