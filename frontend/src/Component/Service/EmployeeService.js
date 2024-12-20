import axios from "axios";
import config from "../config";

const API_BASE_URL = `${config.baseUrl}/Employee`;

const EmployeeService = {
  // Create Employee
  createEmployee: async (employee) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/create`, employee);
      return response.data;
    } catch (error) {
      console.error("Error creating employee:", error);
      throw new Error(
        error.response?.data?.message || "Failed to create employee."
      );
    }
  },

  // Get Employee by ID
  getEmployeeById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching employee by ID:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch employee details."
      );
    }
  },

  // Get All Employees
  getAllEmployees: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/all`);
      return response.data;
    } catch (error) {
      console.error("Error fetching all employees:", error);
      throw new Error(
        error.response?.data?.message || "Failed to fetch employees."
      );
    }
  },

  // Update Employee
  updateEmployee: async (employee) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/update`, employee);
      return response.data;
    } catch (error) {
      console.error("Error updating employee:", error);
      throw new Error(
        error.response?.data?.message || "Failed to update employee."
      );
    }
  },

  // Delete Employee
  deleteEmployee: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/delete/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error deleting employee:", error);
      throw new Error(
        error.response?.data?.message || "Failed to delete employee."
      );
    }
  },

  getEmployeesByClientId: async (clientId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/by-client/${clientId}`);

      return response.data.$values || [];
    } catch (error) {
      console.error(
        `Error fetching employees for client ID ${clientId}:`,
        error
      );
      throw new Error(
        error.response?.data?.message ||
          `Failed to fetch employees for client ID ${clientId}.`
      );
    }
  },
};

export default EmployeeService;
