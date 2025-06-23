// History.jsx
import React, { useState, useEffect } from "react";
import { getTransactions } from "../services/api";
import HistoryNavbar from "../components/HistoryNavbar";
import "./History.css";
const History = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  return (
    <div>
      <HistoryNavbar />
      {transactions.map((txn) => (
        <div key={txn.id} className="transaction-card">
          <p>Amount: ₦{txn.amount}</p>
          <p>To: {txn.recipient}</p>
          <p>Date: {txn.date}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
