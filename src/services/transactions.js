// services/transactions.js
export const createTransaction = async (transactionData) => {
  const res = await fetch(
    "https://68559b621789e182b37bcfe2.mockapi.io/transactions",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(transactionData),
    }
  );
  return await res.json();
};

export const getTransactions = async () => {
  const res = await fetch(
    "https://68559b621789e182b37bcfe2.mockapi.io/transactions"
  );
  return await res.json();
};
