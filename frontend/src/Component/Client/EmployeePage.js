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
        const hasPaidService =
          await ServiceUsageService.getServiceUsageByEmployeeId(emp.idEmployee);
        statuses[emp.idEmployee] = hasPaidService;
      }
      setEmployeeStatus(statuses);
    } catch (error) {
      console.error("Error checking employee services:", error);
    }
  };

  const handleDelete = async (id) => {
    const hasPaidService = employeeStatus[id];
    if (hasPaidService) {
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
      await EmployeeService.deleteEmployee(id);
      setAlert({ message: "Employee deleted successfully!", type: "success" });
      fetchEmployees();
    } catch (error) {
      setAlert({
        message: `Failed to delete employee: ${error.message}`,
        type: "danger",
      });
    }
  };

  const handleUpdate = (employee) => {
    const hasPaidService = employeeStatus[employee.idEmployee];
    if (hasPaidService) {
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

  const handleCreate = () => {
    navigate(`/create-update-employee/${idClient}`);
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
                <td>{emp.wage.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleUpdate(emp)}
                    disabled={employeeStatus[emp.idEmployee]}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.idEmployee)}
                    disabled={employeeStatus[emp.idEmployee]}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center">
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
