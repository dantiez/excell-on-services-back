import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate for navigation
import TransactionService from "../Service/transactionService";
import ServiceUsageService from "../Service/serviceUsageService";
import EmployeeService from "../Service/EmployeeService";
import ServicesService from "../Service/ServicesService";

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [filter, setFilter] = useState("paid");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedServices, setExpandedServices] = useState({});
  const [expandedTransaction, setExpandedTransaction] = useState({});
  const navigate = useNavigate(); // useNavigate hook for navigation

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const data = await TransactionService.getAllTransactions();
        setTransactions(data?.$values || []);
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    const fetchServiceUsages = async () => {
      try {
        const data = await ServiceUsageService.getAllServiceUsages();
        setServiceUsages(data?.$values || []);
      } catch (error) {
        console.error("Error fetching service usages:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await EmployeeService.getAllEmployees();
        setEmployees(data?.$values || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTransactions();
    fetchServiceUsages();
    fetchEmployees();
  }, []);

  const fetchServiceDetails = async (idService) => {
    try {
      if (!servicesDetails[idService]) {
        const service = await ServicesService.getServiceById(idService);
        setServicesDetails((prev) => ({ ...prev, [idService]: service }));
      }
    } catch (error) {
      console.error("Error fetching service by ID:", error);
    }
  };

  const filteredData =
    filter === "paid"
      ? transactions
      : serviceUsages.filter(
          (service) => service.status.trim() === "not yet paid"
        );

  const groupServiceUsages = () => {
    const grouped = {};
    filteredData.forEach((usage) => {
      const key = `${usage.idClient}-${usage.idService}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(usage);
    });
    return grouped;
  };

  const groupedData = groupServiceUsages();
  const serviceUsagesGroups = Object.entries(groupedData).map(
    ([key, group]) => ({
      key,
      group,
    })
  );

  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = serviceUsagesGroups.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(serviceUsagesGroups.length / itemsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const toggleTransactionDetails = (transactionId) => {
    setExpandedTransaction((prev) => ({
      ...prev,
      [transactionId]: !prev[transactionId],
    }));
  };

  const getEmployeeDetails = (idEmployee) =>
    employees.find((employee) => employee.idEmployee === idEmployee);

  const calculateTotalAmount = (serviceId, group) => {
    const serviceDetails = servicesDetails[serviceId];
    if (!serviceDetails) return 0;
    return serviceDetails.price * group.length;
  };

  const handleTransactionDetails = (transaction) => {
    navigate("/Transaction-detail-admin", {
      state: {
        clientId: transaction.idClient,
        transactionDate: transaction.transactionDate,
        status: "paid",
        transactionId: transaction.idTransaction, // Added transactionId here
      },
    });
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Transactions</h1>

      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn btn-outline-primary me-2 ${
            filter === "paid" ? "active" : ""
          }`}
          onClick={() => {
            setFilter("paid");
            setCurrentPage(1);
          }}
        >
          Paid
        </button>
        <button
          className={`btn btn-outline-primary ${
            filter === "not_yet_paid" ? "active" : ""
          }`}
          onClick={() => {
            setFilter("not_yet_paid");
            setCurrentPage(1);
          }}
        >
          Not Yet Paid
        </button>
      </div>

      {filter === "paid" ? (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Client</th>
              <th>Total Amount</th>
              <th>Transaction Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <React.Fragment key={transaction.idTransaction}>
                  <tr>
                    <td>{transaction.client?.name || "N/A"}</td>
                    <td>${transaction.amount?.toFixed(2) || "0.00"}</td>
                    <td>
                      {new Date(
                        transaction.transactionDate
                      ).toLocaleDateString() || "N/A"}
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => handleTransactionDetails(transaction)}
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No transactions available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>Client</th>
              <th>Total Amount</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map(({ key, group }) => {
                const serviceDetails = servicesDetails[group[0]?.idService];
                if (!serviceDetails) {
                  fetchServiceDetails(group[0]?.idService);
                }

                const totalAmount = calculateTotalAmount(
                  group[0]?.idService,
                  group
                );

                return (
                  <React.Fragment key={key}>
                    <tr>
                      <td>{group[0]?.client?.name || "N/A"}</td>
                      <td>${totalAmount?.toFixed(2) || "0.00"}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={() => toggleServiceDetails(key)}
                        >
                          {expandedServices[key] ? "▼" : "▲"}
                        </button>
                      </td>
                    </tr>
                    {expandedServices[key] && (
                      <tr>
                        <td colSpan="3">
                          <strong>Service:</strong>{" "}
                          {serviceDetails?.nameService || "N/A"}
                          <br />
                          <strong>Price:</strong> $
                          {serviceDetails?.price?.toFixed(2) || "0.00"}
                          <br />
                          <strong>Employees Count:</strong> {group.length}
                          <br />
                          {group.map((service) => {
                            const employeeDetails = getEmployeeDetails(
                              service.idEmployee
                            );
                            return (
                              <div key={service.idEmployee}>
                                <strong>Employee:</strong>{" "}
                                {employeeDetails?.name || "N/A"} (
                                {employeeDetails?.position || "N/A"})
                                <br />
                                <strong>Usage Date:</strong>{" "}
                                {new Date(
                                  service.usageDate
                                ).toLocaleDateString() || "N/A"}
                                <hr />
                              </div>
                            );
                          })}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="text-center">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      <nav>
        <ul className="pagination justify-content-center">
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <li
                key={pageNumber}
                className={`page-item ${
                  pageNumber === currentPage ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(pageNumber)}
                >
                  {pageNumber}
                </button>
              </li>
            )
          )}
        </ul>
      </nav>
    </div>
  );
};

export default TransactionPage;
