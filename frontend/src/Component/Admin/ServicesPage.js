import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServicesService from "../Service/ServicesService";
import ServiceUsageService from "../Service/serviceUsageService"; // Import ServiceUsageService here
import AlertMessage from "../AlertMessage";
import "bootstrap/dist/css/bootstrap.min.css";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    fetchServices();
  }, []);

  // Fetch all services
  const fetchServices = async () => {
    try {
      const data = await ServicesService.getAllServices();
      const updatedServices = await Promise.all(
        data.map(async (service) => {
          const isReferenced = await checkServiceUsageExistsByServiceId(
            service.idService
          );
          console.log(
            `Service ID ${service.idService}: isReferenced = ${isReferenced}`
          );
          return { ...service, isReferenced };
        })
      );
      setServices(updatedServices);
    } catch (error) {
      setAlert({
        message: error.message || "An error occurred while fetching services.",
        type: "danger",
      });
    }
  };

  // Check if service is being used (exists in service usages)
  const checkServiceUsageExistsByServiceId = async (serviceId) => {
    try {
      const exists =
        await ServiceUsageService.checkServiceUsageExistsByServiceId(serviceId);
      return exists; // Returns true if the service is in use, false otherwise
    } catch (error) {
      console.error("Error checking service usage:", error);
      return false; // Default to not being in use
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const message = await ServicesService.deleteService(id);
      setAlert({
        message:
          typeof message === "string"
            ? message
            : "Service deleted successfully.",
        type: "success",
      });
      fetchServices();
    } catch (error) {
      setAlert({
        message:
          error.message || "An error occurred while deleting the service.",
        type: "danger",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h1>Services</h1>
      <AlertMessage message={alert.message} type={alert.type} />
      <Link to="/services/create" className="btn btn-primary mb-3">
        Create Service
      </Link>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Content</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {services.map((service) => (
            <tr key={service.idService}>
              <td>{service.idService}</td>
              <td>{service.nameService}</td>
              <td>{service.content}</td>
              <td>${service.price}</td>
              <td>
                <Link
                  to={`/services/update/${service.idService}`}
                  className="btn btn-warning btn-sm me-2"
                  disabled={service.isReferenced} // Disable if service is in use
                  style={{
                    pointerEvents: service.isReferenced ? "none" : "auto", // Additional style to prevent clicks
                    opacity: service.isReferenced ? 0.5 : 1, // Slightly fade the button when disabled
                  }}
                >
                  Update
                </Link>
                <button
                  className={`btn btn-danger btn-sm ${
                    service.isReferenced ? "disabled" : ""
                  }`}
                  onClick={() => handleDelete(service.idService)}
                  disabled={service.isReferenced}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesPage;
