import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import EmployeeService from "../Service/EmployeeService";
import ServiceUsageService from "../Service/serviceUsageService";
import AlertMessage from "../AlertMessage";
import ServicesService from "../Service/ServicesService";

const CreateAndUpdateEmployeePage = () => {
  const { idClient, employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    age: "",
    sex: "",
    phoneNumber: "",
    position: "",
    wage: "",
    idClient: idClient,
  });

  const [serviceUsage, setServiceUsage] = useState({
    idService: "",
    status: "not yet paid",
    totalFee: "",
    usageDate: new Date().toISOString().slice(0, 19),
    transactionDate: null,
    idClient: idClient,
    idServiceUsage: "", // Added to store service usage ID for updating
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [services, setServices] = useState([]);
  const [existingServiceUsage, setExistingServiceUsage] = useState(null); // Track existing service usage

  // Fetch services tied to the employee if editing
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (employeeId) {
          // Fetch paid service usage related to the employee and client
          const paidServiceUsage =
            await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
              employeeId,
              idClient
            );

          if (paidServiceUsage) {
            // If there's a paid service usage, update serviceUsage state
            setServiceUsage((prev) => ({
              ...prev,
              idService: paidServiceUsage.idService || "",
              totalFee: paidServiceUsage.price || "",
              status: "paid", // Mark status as 'paid' if there's a paid service
              idServiceUsage: paidServiceUsage.idServiceUsage, // Store the existing service usage ID
            }));
            setExistingServiceUsage(paidServiceUsage); // Set the existing service usage
          }

          // Fetch services associated with the employee
          const response = await ServiceUsageService.getServicesByEmployee(
            employeeId
          );
          const employeeServices = response?.$values || [];
          if (employeeServices.length > 0) {
            const selectedService = employeeServices[0];
            setServiceUsage((prev) => ({
              ...prev,
              idService: selectedService.idService || "",
              totalFee: selectedService.price || "",
            }));
          }
        }

        // Fetch all services for the dropdown
        const allServicesResponse = await ServicesService.getAllServices();
        setServices(allServicesResponse.$values || allServicesResponse || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setAlert({ message: "Error fetching services.", type: "danger" });
      }
    };
    fetchServices();
  }, [employeeId, idClient]); // Re-fetch when employeeId or idClient changes

  // Pre-fill employee data for editing
  useEffect(() => {
    if (employeeId && location.state?.employee) {
      setEmployee(location.state.employee);
    }
  }, [employeeId, location.state]);

  const handleEmployeeChange = (e) => {
    const { name, value } = e.target;
    setEmployee({ ...employee, [name]: value });
  };

  const handleServiceUsageChange = (e) => {
    const { name, value } = e.target;
    if (name === "idService") {
      const selectedService = services.find(
        (service) => service.idService.toString() === value
      );
      setServiceUsage((prevServiceUsage) => ({
        ...prevServiceUsage,
        [name]: value,
        totalFee: selectedService ? selectedService.price : "",
      }));
    } else {
      setServiceUsage((prevServiceUsage) => ({
        ...prevServiceUsage,
        [name]: value,
      }));
    }
  };

  const validateForm = () => {
    if (
      !employee.name ||
      !employee.age ||
      !employee.phoneNumber ||
      !employee.position ||
      !employee.wage ||
      !employee.sex
    ) {
      setAlert({
        message: "Please fill in all required fields.",
        type: "danger",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (employeeId) {
        // Check for duplicate service usage for this employee
        if (
          existingServiceUsage &&
          existingServiceUsage.idService === serviceUsage.idService
        ) {
          setAlert({
            message: "This service is already assigned to the employee.",
            type: "danger",
          });
          return;
        }

        // Update employee data
        await EmployeeService.updateEmployee(employee);

        // If updating service usage, only update the service ID and ID
        if (serviceUsage.idService) {
          // Call the updateService method to update just the service ID
          await ServiceUsageService.updateService(
            serviceUsage.idServiceUsage,
            serviceUsage.idService
          );
        }

        setAlert({
          message: "Employee and service updated successfully!",
          type: "success",
        });
      } else {
        // Create new employee
        const newEmployee = await EmployeeService.createEmployee(employee);

        // Create new service usage
        const newServiceUsage = {
          ...serviceUsage,
          idEmployee: newEmployee.idEmployee,
          idClient: idClient,
        };

        // Handle transactionDate
        if (!newServiceUsage.transactionDate) {
          delete newServiceUsage.transactionDate; // Don't send transactionDate when creating new
        }

        await ServiceUsageService.createServiceUsage(newServiceUsage);
        setAlert({
          message: "Employee created successfully!",
          type: "success",
        });
      }
      navigate(`/employees/${idClient}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({ message: "Failed to save employee", type: "danger" });
    }
  };

  return (
    <div className="container mt-4">
      <h2>{employeeId ? "Update Employee" : "Create New Employee"}</h2>
      <AlertMessage message={alert.message} type={alert.type} />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={employee.name}
            onChange={handleEmployeeChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            onChange={handleEmployeeChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={employee.phoneNumber}
            onChange={handleEmployeeChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={employee.position}
            onChange={handleEmployeeChange}
            className="form-control"
            required
          />
        </div>
        <div className="mb-3">
          <label>Wage</label>
          <input
            type="number"
            name="wage"
            value={employee.wage}
            onChange={handleEmployeeChange}
            className="form-control"
            required
          />
        </div>

        <div className="mb-3">
          <label>Sex</label>
          <div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="sex"
                value="male"
                checked={employee.sex === "male"}
                onChange={handleEmployeeChange}
                className="form-check-input"
              />
              <label className="form-check-label">Male</label>
            </div>
            <div className="form-check form-check-inline">
              <input
                type="radio"
                name="sex"
                value="female"
                checked={employee.sex === "female"}
                onChange={handleEmployeeChange}
                className="form-check-input"
              />
              <label className="form-check-label">Female</label>
            </div>
          </div>
        </div>

        <h5>Service Usage</h5>
        <div className="mb-3">
          <label>Service</label>
          <select
            name="idService"
            value={serviceUsage.idService || ""}
            onChange={handleServiceUsageChange}
            className="form-control"
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.idService} value={service.idService}>
                {service.nameService} - ${service.price}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" className="btn btn-success">
          {employeeId ? "Update Employee" : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateAndUpdateEmployeePage;
