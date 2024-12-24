import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeService from "../Service/EmployeeService";
import ServiceUsageService from "../Service/serviceUsageService";
import AlertMessage from "../AlertMessage";

const EmployeePage = () => {
  const { idClient } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [employeeStatus, setEmployeeStatus] = useState({});

  useEffect(() => {
    fetchEmployees();
  }, [idClient]);

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getEmployeesByClientId(idClient);
      setEmployees(data);
      await checkEmployeeServices(data);
    } catch (error) {
      setAlert({ message: `Error: ${error.message}`, type: "danger" });
    }
  };

  const checkEmployeeServices = async (employees) => {
    const statuses = {};
    try {
      for (const emp of employees) {
        // Fetch the service usage status for each employee
        const serviceUsage =
          await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
            emp.idEmployee,
            idClient
          );
        console.log("serviceUsage", serviceUsage); // In ra để kiểm tra dữ liệu trả về

        // Check if the service usage status is 'paid' or not
        if (serviceUsage && serviceUsage.status.trim() === "paid") {
          statuses[emp.idEmployee] = "Paid";
        } else {
          statuses[emp.idEmployee] = "Not Yet Paid";
        }
      }
      setEmployeeStatus(statuses);
    } catch (error) {
      console.error("Error checking employee services:", error);
    }
  };

  const handleDelete = async (id) => {
    if (employeeStatus[id] === "Paid") {
      setAlert({
        message: "Cannot delete employee with a paid service.",
        type: "danger",
      });
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this employee?"
    );
    if (!confirmDelete) return;

    try {
      // Step 1: Get the paid service usage for the employee and client
      const serviceUsage =
        await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
          id,
          idClient
        );
      console.log("Service Usage for Delete:", id);
      console.log("Service Usage for Delete:", serviceUsage.id_service_usage);

      // Step 2: If serviceUsage exists, attempt to delete the service usage
      if (serviceUsage && serviceUsage.id_service_usage) {
        console.log(
          "Deleting service usage with id_service_usage:",
          serviceUsage.id_service_usage
        );

        const isServiceUsageDeleted =
          await ServiceUsageService.deleteServiceUsageById(
            serviceUsage.id_service_usage
          );

        // Only proceed to delete the employee if service usage deletion returns true
        if (!isServiceUsageDeleted) {
          setAlert({
            message: `Failed to delete service usage with ID: ${serviceUsage.id_service_usage}. Employee deletion aborted.`,
            type: "danger",
          });
          return;
        }
      }

      // Step 3: Delete the employee
      await EmployeeService.deleteEmployee(id);

      setAlert({
        message: "Employee and associated service usage deleted successfully!",
        type: "success",
      });

      // Refresh the employee list after deletion
      fetchEmployees(); // Fetch again to update the list and state after deletion
    } catch (error) {
      setAlert({
        message: `Failed to delete employee: ${error.message}`,
        type: "danger",
      });
    }
  };

  const handleUpdate = (employee) => {
    if (employeeStatus[employee.idEmployee] === "Paid") {
      setAlert({
        message: "Cannot update employee with a paid service.",
        type: "danger",
      });
      return;
    }
    navigate(`/create-update-employee/${idClient}/${employee.idEmployee}`, {
      state: { employee },
    });
  };

  const handleCreate = async () => {
    try {
      navigate(`/create-update-employee/${idClient}`);

      // Refresh the employee list after creation
      fetchEmployees(); // Fetch again to get the updated list of employees after creation
    } catch (error) {
      setAlert({
        message: `Failed to create new employee: ${error.message}`,
        type: "danger",
      });
    }
  };

  return (
    <div className="container mt-4">
      <h2>Employees for Client ID: {idClient}</h2>
      <AlertMessage message={alert.message} type={alert.type} />
      <button className="btn btn-primary mb-3" onClick={handleCreate}>
        Create New Employee
      </button>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID Employee</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Sex</th>
            <th>Position</th>
            <th>Wage</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.length > 0 ? (
            employees.map((emp) => (
              <tr key={emp.idEmployee}>
                <td>{emp.idEmployee}</td>
                <td>{emp.name}</td>
                <td>{emp.age}</td>
                <td>{emp.phoneNumber}</td>
                <td>{emp.sex}</td>
                <td>{emp.position}</td>
                <td>{emp.wage.toFixed(2)}$</td>
                <td>{employeeStatus[emp.idEmployee]}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleUpdate(emp)}
                    disabled={employeeStatus[emp.idEmployee] === "Paid"} // Disable if service status is 'paid'
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.idEmployee)}
                    disabled={employeeStatus[emp.idEmployee] === "Paid"} // Disable if service status is 'paid'
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="9" className="text-center">
                No employees found for this client.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeePage;
