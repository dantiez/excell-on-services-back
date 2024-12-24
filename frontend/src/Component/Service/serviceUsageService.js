import axios from "axios";
import config from "../config";

const API_BASE_URL = `${config.baseUrl}/ServiceUsage`;

const ServiceUsageService = {
  getAllServiceUsages: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all service usages:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch service usages."
      );
    }
  },

  // Get service usages by status
  getServiceUsagesByStatus: async (status) => {
    try {
      if (!status) throw new Error("Status parameter is required.");
      const response = await axios.get(`${API_BASE_URL}/status/${status}`);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching service usages by status "${status}":`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch service usages by status "${status}".`
      );
    }
  },

  // Get a single service usage by ID
  getServiceUsageById: async (id) => {
    try {
      if (id <= 0) throw new Error("Invalid ID.");
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching service usage with ID ${id}:`, error);
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch service usage with ID ${id}.`
      );
    }
  },

  // Create a new service usage
  createServiceUsage: async (serviceUsageDto) => {
    try {
      if (!serviceUsageDto) throw new Error("Service usage data is required.");
      const response = await axios.post(
        `${API_BASE_URL}/create`,
        serviceUsageDto
      );
      return response.data;
    } catch (error) {
      console.error("Error creating service usage:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create service usage."
      );
    }
  },

  // Update an existing service usage
  updateServiceUsage: async (ServiceUsageDTO) => {
    try {
      if (!ServiceUsageDTO) throw new Error("Service usage data is required.");
      const response = await axios.put(
        `${API_BASE_URL}/update`,
        ServiceUsageDTO
      );
      return response.data;
    } catch (error) {
      console.error("Error updating service usage:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update service usage."
      );
    }
  },

  // Update Service Usage - Change Service ID
  updateService: async (idServiceUsage, newIdService) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-service/${idServiceUsage}/${newIdService}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating service for service usage ${idServiceUsage}:`,
        error
      );
      throw new Error(
        error.response?.data?.message || "Failed to update service ID."
      );
    }
  },

  // Update Service Usage - Change Transaction Date
  updateTransactionDate: async (idServiceUsage, newTransactionDate) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/update-transaction-date/${idServiceUsage}/${newTransactionDate}`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error updating transaction date for service usage ${idServiceUsage}:`,
        error
      );
      throw new Error(
        error.response?.data?.message || "Failed to update transaction date."
      );
    }
  },

  getServiceUsagesByClientStatusAndDate: async (
    idClient,
    status,
    transactionDate
  ) => {
    try {
      let url = `${API_BASE_URL}/client/${idClient}/status/${status}/transactionDate`;

      if (transactionDate) {
        url += `?transactionDate=${transactionDate}`;
      }

      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching service usages by client, status, and transaction date:`,
        error
      );
      throw new Error(
        error.response?.data?.message || "Failed to fetch service usages."
      );
    }
  },

  getServicesByEmployee: async (idEmployee) => {
    try {
      if (idEmployee <= 0) throw new Error("Invalid employee ID.");
      const response = await axios.get(
        `${API_BASE_URL}/employee/${idEmployee}/services`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching services used by employee ID ${idEmployee}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch services for employee ID ${idEmployee}.`
      );
    }
  },

  getPaidServiceUsageByEmployeeAndClient: async (idEmployee, idClient) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/employee/${idEmployee}/client/${idClient}/hasPaidService`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching paid service usage for employee ${idEmployee} and client ${idClient}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch paid service usage for employee ${idEmployee} and client ${idClient}.`
      );
    }
  },
  deleteServiceUsageById: async (idServiceUsage) => {
    try {
      if (idServiceUsage <= 0) throw new Error("Invalid service usage ID.");
      const response = await axios.delete(
        `${API_BASE_URL}/delete/${idServiceUsage}`
      );
      // Return true if deletion succeeded, false otherwise
      return response.data === true;
    } catch (error) {
      console.error(
        `Error deleting service usage with ID ${idServiceUsage}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to delete service usage with ID ${idServiceUsage}.`
      );
    }
  },

  checkServiceUsageExistsByServiceId: async (serviceId) => {
    try {
      if (serviceId <= 0) throw new Error("Invalid service ID.");
      const response = await axios.get(
        `${API_BASE_URL}/service/${serviceId}/exists`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error checking if service usage exists for service ${serviceId}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to check if service usage exists for service ${serviceId}.`
      );
    }
  },

  updateStatus: async (idServiceUsage, newStatus) => {
    try {
      if (!newStatus || !idServiceUsage) {
        throw new Error("ServiceUsage ID and status are required.");
      }

      const response = await axios.put(
        `${API_BASE_URL}/update-status/${idServiceUsage}/${newStatus}`
      );

      return response.data; // Assuming the API returns updated service usage data
    } catch (error) {
      console.error(
        `Error updating status for service usage ${idServiceUsage}:`,
        error
      );
      throw new Error(
        error.response?.data ||
          `Failed to update status for service usage ${idServiceUsage}.`
      );
    }
  },
};

export default ServiceUsageService;
