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

  const verifyRecipient = async () => {
    try {
      // 1. Check account endpoint directly
      const response = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account?accountNumber=${formData.recipientAccNum}`
      );
      const accountData = await response.json();

      // 2. Validate response
      if (!accountData || accountData.length === 0) {
        throw new Error("Account not found");
      }

      // 3. Extract recipient details
      const recipientAccount = accountData[0];
      const recipient = {
        accountNumber: recipientAccount.accountNumber,
        email: recipientAccount.email,
        // Extract name from recipientName field (format: "firstName lastName")
        firstName: recipientAccount.recipientName?.split(" ")[0] || "Unknown",
        lastName: recipientAccount.recipientName?.split(" ")[1] || "User",
        balance: recipientAccount.balance,
        pin: recipientAccount.pin,
        id: recipientAccount.id,
      };

      setRecipient(recipient);
      return true;
    } catch (err) {
      setError(err.message || "Verification failed");
      return false;
    }
  };
  // Transfer.jsx
  const handleTransfer = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    if (!currentUser) {
      setError("User not logged in. Please sign in again.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Validate inputs
      const transferAmount = Number(formData.amount);
      if (isNaN(transferAmount) || transferAmount <= 0) {
        throw new Error("Invalid amount");
      }

      // 2. Verify recipient (using your existing working version)
      if (!(await verifyRecipient())) {
        throw new Error("Recipient verification failed");
      }

      // 3. Check sender balance
      if (currentUser.balance < transferAmount) {
        throw new Error("Insufficient balance");
      }

      // 4. Verify PIN - DEBUGGING VERSION
      const senderAccountRes = await fetch(
        `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${currentUser.id}`
      );
      const senderAccount = await senderAccountRes.json();

      console.log("Entered PIN:", formData.pin, typeof formData.pin);
      console.log("Stored PIN:", senderAccount.pin, typeof senderAccount.pin);

      // Trim and compare as strings
      const enteredPin = formData.pin.toString().trim();
      const storedPin = senderAccount.pin?.toString().trim();

      if (enteredPin !== storedPin) {
        throw new Error("Incorrect PIN");
      }
      // 5. Update balances (PUT requests)
      const updatedSenderBalance = senderAccount.balance - transferAmount;
      const updatedRecipientBalance = recipient.balance + transferAmount;

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
          `https://6851c6998612b47a2c0b38bc.mockapi.io/api/v1/account/${recipient.id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ balance: updatedRecipientBalance }),
          }
        ),
      ]);

      // 6. Record transaction (POST to your transactions API)
      const transactionRes = await fetch(
        "https://68559b621789e182b37bcfe2.mockapi.io/transactions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: transferAmount,
            date: new Date().toISOString(),
            recipientName: `${recipient.firstName} ${recipient.lastName}`,
            recipientAccNum: recipient.accountNumber,
            transactionRef: `TX-${Date.now()}`,
            status: "completed",
            transactionType: "transfer",
            senderName: `${currentUser.firstName} ${currentUser.lastName}`,
          }),
        }
      );

      // 7. Update local state
      const updatedUser = { ...currentUser, balance: updatedSenderBalance };
      setCurrentUser(updatedUser);
      localStorage.setItem("bankUser", JSON.stringify(updatedUser));

      // 8. Navigate to history with success state
      navigate("/history", {
        state: {
          success: true,
          amount: transferAmount,
          recipient: `${recipient.firstName} ${recipient.lastName}`,
        },
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <TransferNavbar />
      <div>
        <form onSubmit={handleTransfer} className="transfer-container">
          <div>
            <h2>Transfer Funds</h2>
            {error && <div className="error">{error}</div>}
          </div>
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
              onChange={(e) =>
                setFormData({ ...formData, pin: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="transfer-button"
          >
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
    </>
  );
};

export default Transfer;
