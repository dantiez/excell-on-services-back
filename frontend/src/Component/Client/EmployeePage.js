import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import EmployeeService from "../Service/EmployeeService";
import ServiceUsageService from "../Service/serviceUsageService";
import AlertMessage from "../AlertMessage";

const EmployeePage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [employeeStatus, setEmployeeStatus] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchEmployees();
  }, [Id]);

  const fetchEmployees = async () => {
    try {
      const data = await EmployeeService.getEmployeesByClientId(Id);
      const sortedData = data.sort((a, b) => b.idEmployee - a.idEmployee);
      setEmployees(sortedData);
      await checkEmployeeServices(sortedData);
    } catch (error) {
      setAlert({ message: `Error: ${error.message}`, type: "danger" });
    }
  };

  const checkEmployeeServices = async (employees) => {
    const statuses = {};
    try {
      for (const emp of employees) {
        const serviceUsage =
          await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
            emp.idEmployee,
            Id
          );

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
      const serviceUsage =
        await ServiceUsageService.getPaidServiceUsageByEmployeeAndClient(
          id,
          Id
        );

      if (serviceUsage && serviceUsage.id_service_usage) {
        const isServiceUsageDeleted =
          await ServiceUsageService.deleteServiceUsageById(
            serviceUsage.id_service_usage
          );

        if (!isServiceUsageDeleted) {
          setAlert({
            message: `Failed to delete service usage with ID: ${serviceUsage.id_service_usage}. Employee deletion aborted.`,
            type: "danger",
          });
          return;
        }
      }

      await EmployeeService.deleteEmployee(id);

      setAlert({
        message: "Employee and associated service usage deleted successfully!",
        type: "success",
      });

      fetchEmployees();
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
    navigate(`/client/create-update-employee/${Id}/${employee.idEmployee}`, {
      state: { employee },
    });
  };

  const handleCreate = async () => {
    try {
      navigate(`/client/create-update-employee/${Id}`);
      fetchEmployees();
    } catch (error) {
      setAlert({
        message: `Failed to create new employee: ${error.message}`,
        type: "danger",
      });
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const paginatedEmployees = employees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(employees.length / itemsPerPage);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Employees Management Of {Id}</h2>
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
          {paginatedEmployees.length > 0 ? (
            paginatedEmployees.map((emp) => (
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
                    disabled={employeeStatus[emp.idEmployee] === "Paid"}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDelete(emp.idEmployee)}
                    disabled={employeeStatus[emp.idEmployee] === "Paid"}
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
      <div className="pagination mt-3 justify-content-center ">
        {[...Array(totalPages).keys()].map((page) => (
          <button
            key={page + 1}
            className={`btn btn-sm ${
              currentPage === page + 1 ? "btn-primary" : "btn-outline-primary"
            } me-2`}
            onClick={() => handlePageChange(page + 1)}
          >
            {page + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EmployeePage;
