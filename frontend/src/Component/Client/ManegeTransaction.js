import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransactionService from "../Service/transactionService";
import ServiceUsageService from "../Service/serviceUsageService";
import EmployeeService from "../Service/EmployeeService";
import ServicesService from "../Service/ServicesService";

const ManegeTransaction = ({ Id }) => {
  const [transactions, setTransactions] = useState([]);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [filter, setFilter] = useState("paid");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();

  // Fetch transactions for the given client ID
  const fetchTransactionsByClient = async () => {
    try {
      const data = await TransactionService.getTransactionsByClientId(Id);
      const sortedTransactions = data?.$values?.sort(
        (a, b) => b.idTransaction - a.idTransaction // Sort by transaction ID descending
      );
      setTransactions(sortedTransactions || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch service usages for the given client ID and status
  const fetchServiceUsagesByClientAndStatus = async () => {
    try {
      const data =
        await ServiceUsageService.getServiceUsagesByClientStatusAndDate(
          Id,
          "not yet paid",
          null
        );

      const filteredServiceUsages = data?.$values
        ?.filter((usage) => usage.status.trim() === "not yet paid")
        .sort((a, b) => b.idService - a.idService);

      setServiceUsages(filteredServiceUsages || []);
    } catch (error) {
      console.error("Error fetching service usages:", error);
    }
  };

  // Fetch service details by service ID
  const fetchServiceDetails = async (serviceIds) => {
    try {
      const details = await Promise.all(
        serviceIds.map((id) => ServicesService.getServiceById(id))
      );
      const newServicesDetails = details.reduce((acc, service) => {
        acc[service.idService] = service;
        return acc;
      }, {});
      setServicesDetails((prev) => ({ ...prev, ...newServicesDetails }));
    } catch (error) {
      console.error("Error fetching service details:", error);
    }
  };

  // Fetch employees
  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await EmployeeService.getAllEmployees();
        setEmployees(data?.$values || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchEmployees();
  }, []);

  // Trigger data fetching based on filter
  useEffect(() => {
    if (Id) {
      if (filter === "paid") {
        fetchTransactionsByClient();
      } else {
        fetchServiceUsagesByClientAndStatus();
      }
    }
  }, [Id, filter]);

  // Fetch service details when service usages are loaded
  useEffect(() => {
    if (filter === "not_yet_paid" && serviceUsages.length > 0) {
      const serviceIds = serviceUsages.map((usage) => usage.idService);
      fetchServiceDetails(serviceIds);
    }
  }, [filter, serviceUsages]);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const toggleExpandedItem = (itemId) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const getEmployeeDetails = (idEmployee) =>
    employees.find((employee) => employee.idEmployee === idEmployee);

  const calculateTotalAmount = (serviceId, group) => {
    const serviceDetails = servicesDetails[serviceId];
    if (!serviceDetails || !serviceDetails.price || !Array.isArray(group))
      return 0;
    return serviceDetails.price * group.length;
  };

  // Group service usages by client ID and service ID
  const groupServiceUsages = () => {
    const grouped = {};
    serviceUsages.forEach((usage) => {
      const key = `${usage.Id}-${usage.idService}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(usage);
    });

    const sortedGroups = Object.entries(grouped).sort(([keyA], [keyB]) => {
      const [IdA, serviceA] = keyA.split("-");
      const [IdB, serviceB] = keyB.split("-");
      return serviceB - serviceA; // Sort by service ID descending
    });

    return sortedGroups.map(([key, group]) => ({
      key,
      group,
    }));
  };

  const groupedData = groupServiceUsages();
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = groupedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(groupedData.length / itemsPerPage);

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Manage Transaction</h1>
      {/* Filter Buttons */}
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
              <th>User</th>
              <th>Total Amount</th>
              <th>Payment Date</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.idTransaction}>
                <td>{transaction.id?.name || "N/A"}</td>
                <td>${transaction.amount?.toFixed(2) || "0.00"}</td>
                <td>
                  {new Date(transaction.transactionDate).toLocaleDateString() ||
                    "N/A"}
                </td>
                <td>
                  {/* Hardcoded status as 'paid' and applying green badge */}
                  <span className="badge bg-success">Paid</span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      navigate("/Profile-Transaction-Detail", {
                        state: {
                          Id: transaction.id,
                          transactionDate: transaction.transactionDate,
                          status: "paid",
                          idTransaction: transaction.idTransaction,
                        },
                      })
                    }
                  >
                    Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(({ key, group }) => {
              const serviceDetails = servicesDetails[group[0]?.idService];
              if (!serviceDetails) return null;

              const totalAmount = calculateTotalAmount(
                group[0]?.idService,
                group
              );

              return (
                <React.Fragment key={key}>
                  <tr>
                    <td>{group[0].Id || "N/A"}</td>
                    <td>${totalAmount?.toFixed(2) || "0.00"}</td>
                    <td>
                      <span
                        className={`badge ${
                          filter === "not_yet_paid" ? "bg-danger" : "bg-success"
                        }`}
                      >
                        {filter === "not_yet_paid" ? "Not Yet Paid" : "Paid"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => toggleExpandedItem(key)}
                      >
                        {expandedItems[key] ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>
                  {expandedItems[key] && (
                    <tr>
                      <td colSpan="4">
                        <strong>Service:</strong>{" "}
                        {serviceDetails?.nameService || "N/A"}
                        <br />
                        <strong>Price:</strong> $
                        {serviceDetails?.price.toFixed(2) || "0"}
                        <br />
                        <strong>Employees:</strong>
                        <ul>
                          {group.map((service) => {
                            const employeeDetails = getEmployeeDetails(
                              service.idEmployee
                            );
                            return (
                              <li key={service.idServiceUsage}>
                                {employeeDetails?.name || "N/A"} -{" "}
                                {employeeDetails?.position || "N/A"} on{" "}
                                {new Date(
                                  service.usageDate
                                ).toLocaleDateString()}
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      )}

      {/* Pagination */}
      {groupedData.length > itemsPerPage && (
        <nav className="d-flex justify-content-center">
          <ul className="pagination">
            {Array.from({ length: totalPages }, (_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
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

export default ManegeTransaction;
