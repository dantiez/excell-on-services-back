import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ServicesService from "../Service/ServicesService";
import AlertMessage from "../AlertMessage";
import "bootstrap/dist/css/bootstrap.min.css";

// I just demo git

const CreateAndUpdateServicePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState({
    nameService: "",
    content: "",
    price: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });

  useEffect(() => {
    if (id) fetchServiceById(id);
  }, [id]);

  const fetchServiceById = async (idService) => {
    try {
      const data = await ServicesService.getServiceById(idService);
      setService(data);
    } catch (error) {
      setAlert({ message: error.message, type: "danger" });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setService({ ...service, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!service.nameService || !service.content || service.price <= 0) {
      setAlert({
        message: "All fields are required and price must be greater than 0.",
        type: "danger",
      });
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
      setTimeout(() => navigate("/services"), 1500); // Redirect after 1.5 seconds
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
            className="form-control"
            id="nameService"
            name="nameService"
            value={service.nameService}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="content" className="form-label">
            Content
          </label>
          <textarea
            className="form-control"
            id="content"
            name="content"
            rows="3"
            value={service.content}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="price" className="form-label">
            Price
          </label>
          <input
            type="number"
            className="form-control"
            id="price"
            name="price"
            value={service.price}
            onChange={handleChange}
            min="1"
            required
          />
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
