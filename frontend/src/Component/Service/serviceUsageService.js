import axios from "axios";
import config from "../config";

const API_BASE_URL = config.baseUrl + "/ServiceUsage";

const ServiceUsageService = {
  getAllServiceUsages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all service usages:", error);
      throw error;
    }
  },

  getServiceUsagesByStatus: async (status) => {
    try {
      if (!status) {
        throw new Error("The status parameter is required.");
      }
      const response = await axios.get(`${API_BASE_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching service usage with status ${status}:`,
        error
      );
      throw error;
    }
  },

  getServiceUsageById: async (id) => {
    try {
      if (id <= 0) {
        throw new Error("Invalid ID.");
      }
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service usage with ID${id}:`, error);
      throw error;
    }
  },

  createServiceUsage: async (serviceUsage) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/record-usage`,
        serviceUsage
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service usage:", error);
      throw error;
    }
  },

  updateServiceUsage: async (serviceUsage) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update`, serviceUsage);
      return response.data;
    } catch (error) {
      console.error("Lỗi khi cập nhật mức sử dụng dịch vụ:", error);
      throw error;
    }
  },

  getServiceUsagesByClient: async (idClient, status, transactionDate) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/by-client-status-date`,
        {
          params: { idClient, status, transactionDate },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching service usage by customer:", error);
      throw error;
    }
  },

  updateTransactionDate: async (idServiceUsage, newTransactionDate) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-transaction-date/${idServiceUsage}`,
        newTransactionDate
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating transaction date for ID service usage ${idServiceUsage}:`,
        error
      );
      throw error;
    }
  },
};

export default ServiceUsageService;
