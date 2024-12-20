import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import EmployeeService from "../Service/EmployeeService";
import ServiceUsageService from "../Service/serviceUsageService";
import ServiceService from "../Service/ServicesService";
import AlertMessage from "../AlertMessage";

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
    idService: location.state?.idService || "",
    status: "not yet paid",
    totalFee: "",
    usageDate: new Date().toISOString().slice(0, 19),
    transactionDate: null,
    idClient: idClient,
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [services, setServices] = useState([]);
  const [existingService, setExistingService] = useState(null);

  // Fetch available services
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await ServiceService.getAllServices();
        const availableServices = response.$values || response || [];
        setServices(availableServices);
      } catch (error) {
        console.error("Error fetching services:", error);
        setAlert({ message: "Error fetching services", type: "danger" });
        setServices([]);
      }
    };
    fetchServices();
  }, []);

  // Fetch current service usage for employee if editing
  useEffect(() => {
    if (employeeId) {
      const fetchServiceUsage = async () => {
        try {
          const usage = await ServiceUsageService.getServiceUsageByEmployeeId(
            employeeId
          );
          console.log("Fetched Service Usage for Employee ID:", usage);

          if (usage && usage.$values && usage.$values.length > 0) {
            const selectedService = usage.$values[0];
            setExistingService(selectedService);
            setServiceUsage((prev) => ({
              ...prev,
              idService: selectedService.idService || "",
              status: selectedService.status || "not yet paid",
              totalFee: selectedService.price || "",
            }));
          } else {
            console.warn("No service usage found for this employee.");
          }
        } catch (error) {
          console.error("Error fetching service usage:", error);
        }
      };
      fetchServiceUsage();
    }
  }, [employeeId]);

  // Pre-fill employee data for editing
  useEffect(() => {
    if (employeeId && location.state?.employee) {
      setEmployee(location.state.employee);
      console.log("Pre-filled Employee Data:", location.state?.employee);
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
      console.log(
        "Selected Service ID:",
        value,
        "Selected Service:",
        selectedService
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
      console.log("Submitting form for Employee:", employee);
      console.log("Service Usage to Submit:", serviceUsage);

      if (employeeId) {
        await EmployeeService.updateEmployee(employee);
        await ServiceUsageService.updateServiceUsage({
          ...serviceUsage,
          idEmployee: employeeId,
          idClient: idClient,
        });
        setAlert({
          message: "Employee updated successfully!",
          type: "success",
        });
      } else {
        const newEmployee = await EmployeeService.createEmployee(employee);
        await ServiceUsageService.createServiceUsage({
          ...serviceUsage,
          idEmployee: newEmployee.idEmployee,
          idClient: idClient,
        });
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
            {services.length > 0 ? (
              services.map((service) => (
                <option key={service.idService} value={service.idService}>
                  {service.nameService}
                </option>
              ))
            ) : (
              <option value="">No services available</option>
            )}
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
