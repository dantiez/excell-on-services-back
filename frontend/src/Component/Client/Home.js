import React, { useEffect, useState } from "react";
import ServicesService from "../Service/ServicesService";
import { FaHeadset, FaPhoneAlt, FaBullhorn } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  // Define service names to fetch dynamically
  const validServiceNames = ["In-bound", "Out-bound", "Tele Marketing"];

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Fetch services by names
        const fetchedServices = await Promise.all(
          validServiceNames.map(async (name) => {
            const response = await ServicesService.getServicesByName(name);
            return response.$values[0]; // Extract the first service object from the API response
          })
        );

        setServices(fetchedServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const getServiceIcon = (nameService) => {
    switch (nameService) {
      case "In-bound":
        return <FaHeadset size={40} color="#4CAF50" />;
      case "Out-bound":
        return <FaPhoneAlt size={40} color="#2196F3" />;
      case "Tele Marketing":
        return <FaBullhorn size={40} color="#FF5722" />;
      default:
        return null;
    }
  };

  // Handle card click to navigate with service ID
  const handleCardClick = (idClient, idService) => {
    navigate(`/create-update-employee/${idClient}`, { state: { idService } });
  };

  return (
    <div className="container my-4">
      <h2 className="text-center mb-4">Our Services</h2>
      <div className="d-flex justify-content-between">
        {services.map((service) => (
          <div
            key={service.idService}
            className="card text-center shadow-sm"
            style={{
              width: "30%",
              padding: "20px",
              border: "1px solid #ddd",
              borderRadius: "10px",
              cursor: "pointer",
            }}
            onClick={() => handleCardClick(1, service.idService)} // Pass idClient and idService
          >
            <div>{getServiceIcon(service.nameService)}</div>
            <h4 className="mt-3">{service.nameService}</h4>
            <p className="text-muted">${service.price.toFixed(2)}</p>
            <p>{service.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
