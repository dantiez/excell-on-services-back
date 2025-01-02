import axios from "axios";
import { toast } from "sonner";
import config from "../config";

const API_BASE_URL = `${config.baseUrl}/User`;

const UserService = {
  getAllUsers: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(error);
      throw error;
    }
  },

  getUserById: async (userId) => {
    try {
      if (userId <= 0) {
        throw new Error("Invalid user ID.");
      }

      const response = await axios.get(`${API_BASE_URL}/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  createUser: async (userData) => {
    try {
      if (!userData) {
        throw new Error("User data is required.");
      }

      const response = await axios.post(`${API_BASE_URL}`, userData);
      return response.data;
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      if (userId <= 0) {
        throw new Error("Invalid user ID.");
      }

      const response = await axios.put(`${API_BASE_URL}/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },
  updateCurrentUser: async (userId, userData) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/currentUser/${userId}`,
        userData,
      );
      return response;
    } catch (error) {
      throw error;
    }
  },
  deleteUser: async (userId) => {
    try {
      if (userId <= 0) {
        throw new Error("Invalid user ID.");
      }

      await axios.delete(`${API_BASE_URL}/${userId}`);
      return true;
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },
};

export default UserService;
