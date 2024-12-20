import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TransactionService from "../Service/transactionService";
import ServiceUsageService from "../Service/serviceUsageService";
import EmployeeService from "../Service/EmployeeService";
import ServicesService from "../Service/ServicesService";

const ProfilePage = () => {
  const [transactions, setTransactions] = useState([]);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [filter, setFilter] = useState("not_yet_paid");
  const [idClient, setIdClient] = useState(1); // Fixed client ID
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedItems, setExpandedItems] = useState({});
  const navigate = useNavigate();

  // Fetch transactions for the given client ID
  const fetchTransactionsByClient = async () => {
    try {
      const data = await TransactionService.getTransactionsByClientId(idClient);
      setTransactions(data?.$values || []);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  // Fetch service usages for the given client ID and status
  const fetchServiceUsagesByClientAndStatus = async () => {
    try {
      const data =
        await ServiceUsageService.getServiceUsagesByClientStatusAndDate(
          idClient,
          "not yet paid",
          null
        );
      setServiceUsages(data?.$values || []);
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
    if (idClient) {
      if (filter === "paid") {
        fetchTransactionsByClient();
      } else {
        fetchServiceUsagesByClientAndStatus();
      }
    }
  }, [idClient, filter]);

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

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Profile</h1>
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

      {/* Display service usages or transactions */}
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
            {transactions.map((transaction) => (
              <tr key={transaction.idTransaction}>
                <td>{transaction.client?.name || "N/A"}</td>
                <td>${transaction.amount?.toFixed(2) || "0.00"}</td>
                <td>
                  {new Date(transaction.transactionDate).toLocaleDateString() ||
                    "N/A"}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-secondary"
                    onClick={() =>
                      navigate("/Profile-Transaction-Detail", {
                        state: {
                          clientId: transaction.idClient,
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
              <th>Client</th>
              <th>Total Amount</th>
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
                    <td>{group[0]?.client?.name || "N/A"}</td>
                    <td>${totalAmount?.toFixed(2) || "0.00"}</td>
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
                      <td colSpan="3">
                        <strong>Service:</strong>{" "}
                        {serviceDetails?.nameService || "N/A"}
                        <br />
                        <strong>Price:</strong> $
                        {serviceDetails?.price?.toFixed(2) || "0.00"}
                        <br />
                        <strong>Employees:</strong>
                        <ul>
                          {group.map((service) => {
                            const employeeDetails = getEmployeeDetails(
                              service.idEmployee
                            );
                            return (
                              <li key={service.idEmployee}>
                                {employeeDetails?.name || "N/A"} -{" "}
                                {employeeDetails?.position || "N/A"}
                                {" - "}
                                {new Date(
                                  service.usageDate
                                ).toLocaleDateString() || "N/A"}
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
      <nav>
        <ul className="pagination justify-content-center">
          <li
            className="page-item"
            onClick={() => handlePageChange(currentPage - 1)}
          >
            <a className="page-link" href="#">
              Previous
            </a>
          </li>
          <li
            className="page-item"
            onClick={() => handlePageChange(currentPage + 1)}
          >
            <a className="page-link" href="#">
              Next
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default ProfilePage;
