import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ServicesService from "../Service/ServicesService";
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
      // Fetch usage status for each service
      const updatedServices = await Promise.all(
        data.map(async (service) => {
          const isReferenced = await checkIfServiceIsUsed(service.idService);
          return { ...service, isReferenced };
        })
      );
      setServices(updatedServices);
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
    }
  };

  // Check if service is referenced
  const checkIfServiceIsUsed = async (id) => {
    try {
      const service = await ServicesService.getServiceById(id);
      return service.isReferenced || false; // Backend must return 'isReferenced'
    } catch (error) {
      console.error("Error checking service usage:", error);
      return false; // Default to not being referenced
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this service?"))
      return;

    try {
      const message = await ServicesService.deleteService(id);
      setAlert({ message, type: "success" });
      fetchServices();
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
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
                {service.isReferenced && (
                  <span className="text-danger ms-2">In Use</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ServicesPage;
