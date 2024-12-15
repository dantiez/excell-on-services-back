import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Giả sử bạn đang sử dụng axios để gọi API

const TransactionPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [filter, setFilter] = useState("paid");
  const [currentPage, setCurrentPage] = useState(1);
  const transactionsPerPage = 10;
  const [expandedServices, setExpandedServices] = useState({});
  const navigate = useNavigate();

  // Fetch transactions và service usages từ API
  useEffect(() => {
    // Fetch Transactions
    const fetchTransactions = async () => {
      try {
        const response = await axios.get("/api/transactions"); // API URL thực tế của bạn
        setTransactions(response.data); // Lưu dữ liệu trả về
      } catch (error) {
        console.error("Error fetching transactions:", error);
      }
    };

    // Fetch Service Usages
    const fetchServiceUsages = async () => {
      try {
        const response = await axios.get("/api/service-usages"); // API URL thực tế của bạn
        const updatedServiceUsages = response.data.map((service) => ({
          ...service,
          num_people: service.employees.length,
          totalAmount: service.price * service.employees.length,
        }));
        setServiceUsages(updatedServiceUsages); // Lưu dữ liệu trả về
      } catch (error) {
        console.error("Error fetching service usages:", error);
      }
    };

    // Gọi các API
    fetchTransactions();
    fetchServiceUsages();
  }, []);

  const filteredData =
    filter === "paid"
      ? transactions.filter((transaction) => transaction.status === "paid")
      : serviceUsages.filter((service) => service.status === "not_yet_paid");

  const indexOfLastItem = currentPage * transactionsPerPage;
  const indexOfFirstItem = indexOfLastItem - transactionsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / transactionsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prevState) => ({
      ...prevState,
      [serviceId]: !prevState[serviceId],
    }));
  };

  return (
    <div className="container my-4">
      <h1 className="text-center mb-4">Transactions</h1>

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

      {/* Transactions Table */}
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Client</th>
            <th>Total Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filter === "paid"
            ? currentItems.map((transaction) => (
                <tr key={transaction.id_transaction}>
                  <td>{transaction.Client?.name_Client || "N/A"}</td>
                  <td>${transaction.amount.toFixed(2)}</td>
                  <td>{transaction.status}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-info text-white"
                      onClick={() =>
                        transaction.id_client
                          ? navigate(`/Transaction-detail-admin`, {
                              state: {
                                transactionId: transaction.id_transaction,
                              },
                            })
                          : alert("Client ID is undefined")
                      }
                    >
                      Details
                    </button>
                  </td>
                </tr>
              ))
            : currentItems.map((service) => (
                <React.Fragment key={service.id}>
                  <tr>
                    <td>{service.client.name}</td>
                    <td>${service.totalAmount.toFixed(2)}</td>
                    <td>{service.status}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() => toggleServiceDetails(service.id)}
                      >
                        {expandedServices[service.id] ? "▲" : "▼"}
                      </button>
                    </td>
                  </tr>
                  {expandedServices[service.id] && (
                    <tr>
                      <td colSpan="4">
                        <strong>Service:</strong> {service.service_name}
                        <br />
                        <strong>Price per Person:</strong> $
                        {service.price.toFixed(2)}
                        <br />
                        <strong>Total Number of People:</strong>{" "}
                        {service.num_people}
                        <br />
                        <strong>Employees:</strong>
                        <ul>
                          {service.employees.map((employee) => (
                            <li key={employee.id}>
                              {employee.name} ({employee.role}) -{" "}
                              {employee.phone}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
        </tbody>
      </table>

      {/* Pagination */}
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
