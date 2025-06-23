import axios from "axios";

const API_URL = "https://mockapi.io/projects/68559b621789e182b37bcfe2";
const getTransactions = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};
export { getTransactions };

export const addTransaction = async (transaction) => {
  const response = await axios.post(API_URL, transaction);
  return response.data;
};
