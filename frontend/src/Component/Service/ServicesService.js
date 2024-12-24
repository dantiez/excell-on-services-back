import axios from "axios";
import config from "../config";

const API_BASE_URL = `${config.baseUrl}/Services`;

const ServicesService = {
  // Create Service
  createService: async (service) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, service);
      return response.data;
    } catch (error) {
      console.error("Error creating service:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create service."
      );
    }
  },

  // Get Service by ID
  getServiceById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching service by ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch service details."
      );
    }
  },

  // Get All Services
  getAllServices: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data.$values || response.data || [];
    } catch (error) {
      console.error("Error fetching all services:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch services."
      );
    }
  },

  // Update Service
  updateService: async (service) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update`, service);
      return response.data;
    } catch (error) {
      console.error("Error updating service:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update service."
      );
    }
  },

  // Delete Service
  deleteService: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting service:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete service."
      );
    }
  },

  getServicesByName: async (name) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/searchByName`, {
        params: { name }, // Pass the name as a query parameter
      });
      return response.data;
    } catch (error) {
      console.error("Error searching services by name:", error);
      throw new Error(
        error.response?.data?.message || "Failed to search services by name."
      );
    }
  },
};

export default ServicesService;
