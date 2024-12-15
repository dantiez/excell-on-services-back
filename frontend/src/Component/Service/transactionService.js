import axios from "axios";
import config from "../config";

const API_BASE_URL = config.baseUrl + "/Transaction";

const TransactionService = {
  // Get all transactions
  getAllTransactions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      throw error;
    }
  },

  // Create a new transaction
  createTransaction: async (transaction) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, transaction);
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  // Get transactions by client ID
  getTransactionsByClientId: async (idClient) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/by-client/${idClient}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions by client ID:", error);
      throw error;
    }
  },
};

export default TransactionService;
