import React, { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import EmployeeService from "../Service/EmployeeService";
import ServiceUsageService from "../Service/serviceUsageService";
import AlertMessage from "../AlertMessage";
import ServicesService from "../Service/ServicesService";

const CreateAndUpdateEmployeePage = () => {
  const { Id, employeeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [employee, setEmployee] = useState({
    name: "",
    age: "",
    sex: "",
    phoneNumber: "",
    position: "",
    wage: "",
    Id: Id,
  });

  const [serviceUsage, setServiceUsage] = useState({
    idService: "",
    status: "not yet paid",
    totalFee: "",
    usageDate: new Date().toISOString().slice(0, 19),
    transactionDate: null,
    Id: Id,
    idEmployee: "",
  });

  const [alert, setAlert] = useState({ message: "", type: "" });
  const [services, setServices] = useState([]);
  const [existingServiceUsage, setExistingServiceUsage] = useState(null);
  const [errors, setErrors] = useState({});

  const calculateRetirementAge = (sex) => {
    // Assuming retirement age is 60 for females and 65 for males
    return sex === "female" ? 60 : 65;
  };

  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (employeeId) {
          // Fetch paid service usage
          const paidServiceUsage =
            await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
              employeeId,
              Id
            );
          if (paidServiceUsage) {
            setServiceUsage((prev) => ({
              ...prev,
              idService: paidServiceUsage.idService || "",
              totalFee: paidServiceUsage.total_fee || "",
              status: paidServiceUsage.status,
              idServiceUsage: paidServiceUsage.id_service_usage, // Get id_service_usage from the returned data
            }));
            setExistingServiceUsage(paidServiceUsage);
          }

          // Fetch services related to the employee
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

        // Fetch all services
        const allServicesResponse = await ServicesService.getAllServices();
        setServices(allServicesResponse.$values || allServicesResponse || []);
      } catch (error) {
        console.error("Error while fetching services:", error);
        setAlert({ message: "Error while fetching services.", type: "danger" });
      }
    };

    fetchServices();
  }, [employeeId, Id]);

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
        idService: value,
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
    const newErrors = {};

    // Name validation
    if (!employee.name.trim()) newErrors.name = "Name is required.";
    else if (employee.name.length > 200)
      newErrors.name = "Name cannot exceed 200 characters.";

    // Age validation
    if (!employee.age || isNaN(employee.age) || employee.age < 18) {
      newErrors.age = "Age must be at least 18.";
    } else {
      const retirementAge = calculateRetirementAge(employee.sex);
      if (employee.age > retirementAge)
        newErrors.age = `Age must be below ${retirementAge} years.`;
      else if (employee.age.toString().length > 3)
        newErrors.age = "Age must be a valid 3-digit number.";
    }

    // Phone number validation
    if (!employee.phoneNumber.trim())
      newErrors.phoneNumber = "Phone number is required.";

    if (!employee.position.trim()) newErrors.position = "Position is required.";
    else if (employee.position.length > 200)
      newErrors.position = "Position cannot exceed 200 characters.";

    // Sex validation
    if (!employee.sex) newErrors.sex = "Please select a gender.";

    // Service selection validation
    if (!serviceUsage.idService)
      newErrors.idService = "Please select a service.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      console.log("Employee Data: ", employee); // Log employee data
      console.log("Service Usage Data: ", serviceUsage); // Log service usage data

      if (employeeId) {
        // Update employee
        await EmployeeService.updateEmployee(employee);
        console.log("Employee Updated: ", employee); // Log when updating employee

        // Update service if exists
        if (serviceUsage.idService && existingServiceUsage) {
          // Get id_service_usage from `existingServiceUsage`
          const idServiceUsage = existingServiceUsage.id_service_usage;

          await ServiceUsageService.updateService(
            idServiceUsage, // Use the current id_service_usage
            serviceUsage.idService
          );
          console.log("Service Updated: ", serviceUsage); // Log when updating service
        }

        setAlert({
          message: "Employee and service have been updated successfully!",
          type: "success",
        });
      } else {
        // Remove idEmployee from employee object before sending to API
        const { idEmployee, ...employeeData } = employee; // Exclude idEmployee

        // Create new employee without idEmployee
        const newEmployee = await EmployeeService.createEmployee(employeeData);
        console.log("New Employee Created: ", newEmployee); // Log when creating new employee

        // Set the idEmployee for service usage after employee creation
        const newServiceUsage = {
          ...serviceUsage,
          idEmployee: newEmployee.idEmployee, // Set idEmployee from the created employee
          Id: Id,
        };

        console.log("New Service Usage Created: ", newServiceUsage); // Log when creating new service usage

        // Remove transactionDate if not available
        if (!newServiceUsage.transactionDate) {
          delete newServiceUsage.transactionDate;
        }

        // Call API to create service usage
        await ServiceUsageService.createServiceUsage(newServiceUsage);

        setAlert({
          message: "Employee has been created successfully!",
          type: "success",
        });
      }

      // Refresh employee list or update state after success
      navigate(`/Profile/${Id}`);
    } catch (error) {
      console.error("Error submitting form:", error);
      setAlert({ message: "Could not save employee.", type: "danger" });
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
            className={`form-control ${errors.name ? "is-invalid" : ""}`}
          />
          {errors.name && <div className="invalid-feedback">{errors.name}</div>}
        </div>
        <div className="mb-3">
          <label>Age</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            onChange={handleEmployeeChange}
            className={`form-control ${errors.age ? "is-invalid" : ""}`}
          />
          {errors.age && <div className="invalid-feedback">{errors.age}</div>}
        </div>
        <div className="mb-3">
          <label>Phone Number</label>
          <input
            type="text"
            name="phoneNumber"
            value={employee.phoneNumber}
            onChange={handleEmployeeChange}
            className={`form-control ${errors.phoneNumber ? "is-invalid" : ""}`}
          />
          {errors.phoneNumber && (
            <div className="invalid-feedback">{errors.phoneNumber}</div>
          )}
        </div>
        <div className="mb-3">
          <label>Position</label>
          <input
            type="text"
            name="position"
            value={employee.position}
            onChange={handleEmployeeChange}
            className={`form-control ${errors.position ? "is-invalid" : ""}`}
          />
          {errors.position && (
            <div className="invalid-feedback">{errors.position}</div>
          )}
        </div>
        <div className="mb-3">
          <label>Wage</label>
          <input
            type="number"
            name="wage"
            value={employee.wage}
            onChange={handleEmployeeChange}
            className={`form-control ${errors.wage ? "is-invalid" : ""}`}
          />
          {errors.wage && <div className="invalid-feedback">{errors.wage}</div>}
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
                className={`form-check-input ${errors.sex ? "is-invalid" : ""}`}
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
                className={`form-check-input ${errors.sex ? "is-invalid" : ""}`}
              />
              <label className="form-check-label">Female</label>
            </div>
          </div>
          {errors.sex && <div className="invalid-feedback">{errors.sex}</div>}
        </div>
        <h5>Service Usage</h5>
        <div className="mb-3">
          <label>Service</label>
          <select
            name="idService"
            value={serviceUsage.idService || ""}
            onChange={handleServiceUsageChange}
            className={`form-control ${errors.idService ? "is-invalid" : ""}`}
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.idService} value={service.idService}>
                {service.nameService} - ${service.price}
              </option>
            ))}
          </select>
          {errors.idService && (
            <div className="invalid-feedback">{errors.idService}</div>
          )}
        </div>
        <button type="submit" className="btn btn-success">
          {employeeId ? "Update Employee" : "Create Employee"}
        </button>
      </form>
    </div>
  );
};

export default CreateAndUpdateEmployeePage;
