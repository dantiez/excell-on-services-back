import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServicesService from "../Service/ServicesService";
import AlertMessage from "../AlertMessage";
import "bootstrap/dist/css/bootstrap.min.css";

const CreateAndUpdateServicePage = () => {
  const { id } = useParams(); // Service ID (if present) for updating
  const navigate = useNavigate();

  // Service state
  const [service, setService] = useState({
    nameService: "",
    content: "",
    price: "",
  });

  // Error messages for each field
  const [errors, setErrors] = useState({
    nameService: "",
    content: "",
    price: "",
  });

  // General alert message
  const [alert, setAlert] = useState({ message: "", type: "" });

  // Fetch service data when updating
  useEffect(() => {
    if (id) fetchServiceById(id);
  }, [id]);

  // Fetch service details by ID
  const fetchServiceById = async (idService) => {
    try {
      const data = await ServicesService.getServiceById(idService);
      setService(data);
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
    }
  };

  // Check if the service name already exists
  const checkIfServiceNameExists = async (nameService) => {
    try {
      const response = await ServicesService.getServicesByName(nameService);
      return response.$values && response.$values.length > 0;
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
      return false;
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Reset error when user starts typing
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = { nameService: "", content: "", price: "" };

    // Validate input data
    if (!service.nameService.trim()) {
      newErrors.nameService = "Service name is required.";
      hasErrors = true;
    } else if (
      service.nameService.length < 3 ||
      service.nameService.length > 200
    ) {
      newErrors.nameService =
        "Service name must be between 3 and 200 characters.";
      hasErrors = true;
    } else if (!id) {
      const serviceNameExists = await checkIfServiceNameExists(
        service.nameService
      );
      if (serviceNameExists) {
        newErrors.nameService =
          "Service name already exists. Please choose another.";
        hasErrors = true;
      }
    }

    if (!service.content.trim()) {
      newErrors.content = "Service content is required.";
      hasErrors = true;
    } else if (service.content.length < 3 || service.content.length > 200) {
      newErrors.content =
        "Service content must be between 3 and 200 characters.";
      hasErrors = true;
    }

    if (!service.price || isNaN(service.price) || service.price <= 0) {
      newErrors.price = "Price must be a positive number.";
      hasErrors = true;
    }

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    try {
      if (id) {
        await ServicesService.updateService(service);
        setAlert({ message: "Service updated successfully.", type: "success" });
      } else {
        await ServicesService.createService(service);
        setAlert({ message: "Service created successfully.", type: "success" });
      }
      setTimeout(() => navigate("/services"), 1500); // Navigate after 1.5 seconds
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
    }
  };

  return (
    <div className="container mt-5">
      <h1>{id ? "Update Service" : "Create Service"}</h1>
      <AlertMessage message={alert.message} type={alert.type} />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nameService" className="form-label">
            Service Name
          </label>
          <input
            type="text"
            className={`form-control ${errors.nameService ? "is-invalid" : ""}`}
            id="nameService"
            name="nameService"
            value={service.nameService}
            onChange={handleChange}
          />
          {errors.nameService && (
            <div className="invalid-feedback">{errors.nameService}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Service Content
          </label>
          <textarea
            className={`form-control ${errors.content ? "is-invalid" : ""}`}
            id="content"
            name="content"
            rows="3"
            value={service.content}
            onChange={handleChange}
          />
          {errors.content && (
            <div className="invalid-feedback">{errors.content}</div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            min="1"
          />
          {errors.price && (
            <div className="invalid-feedback">{errors.price}</div>
          )}
        </div>
        <button type="submit" className="btn btn-success">
          {id ? "Update" : "Create"}
        </button>
        <button
          type="button"
          className="btn btn-secondary ms-2"
          onClick={() => navigate("/services")}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreateAndUpdateServicePage;
