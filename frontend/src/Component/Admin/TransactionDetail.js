import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const TransactionDetailPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [transaction, setTransaction] = useState(null);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [expandedServices, setExpandedServices] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const employeesPerPage = 5;

  useEffect(() => {
    const fetchTransactionDetails = async () => {
      try {
        const response = await axios.get(
          `/api/transaction/${location.state?.transactionId}`
        );
        setTransaction(response.data);
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    const fetchServiceUsages = async () => {
      try {
        const response = await axios.get(
          `/api/transaction/${location.state?.transactionId}/services`
        );
        setServiceUsages(response.data);
      } catch (error) {
        console.error("Error fetching service usages:", error);
      }
    };

    fetchTransactionDetails();
    fetchServiceUsages();
  }, [location.state?.transactionId]);

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  const paginateEmployees = (employees) => {
    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    return employees.slice(indexOfFirstEmployee, indexOfLastEmployee);
  };

  const nextPage = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev > 1 ? prev - 1 : 1));
  };

  return (
    <div className="container mt-4">
      <h2>Transaction Details</h2>
      {transaction && (
        <div className="card mb-4">
          <div className="card-body">
            <p>
              <strong>Client ID:</strong> {transaction.id_client}
            </p>
            <p>
              <strong>Transaction Date:</strong>{" "}
              {new Date(transaction.transaction_date).toLocaleDateString()}
            </p>
            <p>
              <strong>Status:</strong> {transaction.status}
            </p>
            <p>
              <strong>Amount:</strong> ${transaction.amount}
            </p>
            <p>
              <strong>Payment Method:</strong> {transaction.payment_method}
            </p>
          </div>
        </div>
      )}

      <h3>Service Usages</h3>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Service</th>
            <th>Total Fee</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {serviceUsages.map((service) => (
            <React.Fragment key={service.id_service_usage}>
              <tr>
                <td>{service.service_name}</td>
                <td>${service.total_fee?.toFixed(2) || "0.00"}</td>
                <td>{service.status}</td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      toggleServiceDetails(service.id_service_usage)
                    }
                  >
                    {expandedServices[service.id_service_usage] ? "▲" : "▼"}{" "}
                    Service Details
                  </button>
                </td>
              </tr>

              {expandedServices[service.id_service_usage] && (
                <tr>
                  <td colSpan="4">
                    <strong>Service:</strong> {service.service_name}
                    <br />
                    <strong>Price:</strong> ${service.total_fee?.toFixed(2)}
                    <br />
                    <strong>Number of Employees:</strong>{" "}
                    {service.employees.length}
                    <br />
                    <strong>Employees:</strong>
                    <ul>
                      {paginateEmployees(service.employees).map((employee) => (
                        <li key={employee.id}>
                          {employee.name} ({employee.role}) - {employee.phone}
                          <br />
                          <strong>Usage Date:</strong>{" "}
                          {new Date(employee.usage_date).toLocaleDateString()}
                        </li>
                      ))}
                    </ul>
                    <div className="d-flex justify-content-between">
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={prevPage}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </button>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={nextPage}
                        disabled={
                          currentPage ===
                          Math.ceil(service.employees.length / employeesPerPage)
                        }
                      >
                        Next
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TransactionDetailPage;
