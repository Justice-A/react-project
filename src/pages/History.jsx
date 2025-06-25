// History.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import HistoryNavbar from "../components/HistoryNavbar";
import "../services/transactions";
import "./History.css";

const History = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Check for successful transfer state
        if (location.state?.success) {
          alert(
            `Successfully transferred ₦${location.state.amount} to ${location.state.recipient}`
          );
        }

        // 2. Fetch all transactions
        const response = await fetch(
          "https://68559b621789e182b37bcfe1.mockapi.io/api/v1/transactions"
        );
        const data = await response.json();
        setTransactions(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
  }, [location.state]);

  return (
    <div>
      <HistoryNavbar />
      <div className="history-container">
        {transactions.map((txn) => (
          <div key={txn.id} className="transaction-card">
            <p>
              <strong>Type:</strong> {txn.transactionType}
            </p>
            <p>
              <strong>Amount:</strong> ₦{txn.amount}
            </p>
            <p>
              <strong>To:</strong> {txn.recipientName} ({txn.recipientAccNum})
            </p>
            <p>
              <strong>Date:</strong> {new Date(txn.date).toLocaleString()}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              <span className={`status-${txn.status}`}>{txn.status}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
