import axios from "axios";
import config from "../config";

// Define the base API URL for transactions
const API_BASE_URL = `${config.baseUrl}/Transaction`;

const TransactionService = {
  /**
   * Fetch all transactions
   * @returns {Promise<Object[]>} A list of transactions
   */
  getAllTransactions: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all transactions:", error);
      throw error;
    }
  },

  /**
   * Create a new transaction
   * @param {Object} transactionDto - Data for the new transaction
   * @returns {Promise<Object>} The created transaction
   * @throws {Error} If transaction data is invalid or the request fails
   */
  createTransaction: async (transactionDto) => {
    try {
      if (!transactionDto) {
        throw new Error("Transaction data is required.");
      }

      const response = await axios.post(
        `${API_BASE_URL}/create`,
        transactionDto
      );
      return response.data;
    } catch (error) {
      console.error("Error creating transaction:", error);
      throw error;
    }
  },

  getTransactionsByClientId: async (Id) => {
    try {
      if (Id <= 0) {
        throw new Error("Invalid User ID.");
      }

      const response = await axios.get(`${API_BASE_URL}/by-User/${Id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching transactions by User ID ${Id}:`, error);
      throw error;
    }
  },

  /**
   * Fetch a transaction by ID
   * @param {number} idTransaction - The transaction ID
   * @returns {Promise<Object>} The transaction for the specified ID
   * @throws {Error} If the transaction ID is invalid or the request fails
   */
  getTransactionById: async (idTransaction) => {
    try {
      if (idTransaction <= 0) {
        throw new Error("Invalid transaction ID.");
      }

      const response = await axios.get(`${API_BASE_URL}/${idTransaction}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching transaction by ID ${idTransaction}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch transaction with ID ${idTransaction}.`
      );
    }
  },

  getTransactionsByDateRange: async (startDate, endDate) => {
    try {
      if (!startDate || !endDate) {
        throw new Error("Both start and end dates are required.");
      }

      const formattedStartDate = new Date(startDate).toISOString();
      const formattedEndDate = new Date(endDate).toISOString();

      const response = await axios.get(
        `${API_BASE_URL}/by-date-range?startDate=${formattedStartDate}&endDate=${formattedEndDate}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching transactions by date range:", error);
      throw error;
    }
  },
};

export default TransactionService;
