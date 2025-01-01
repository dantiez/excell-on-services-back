import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import TransactionService from "../Service/transactionService";
import ServiceUsageService from "../Service/serviceUsageService";
import EmployeeService from "../Service/EmployeeService";
import ServicesService from "../Service/ServicesService";

const ProfileTransactionDetail = () => {
  const [transaction, setTransaction] = useState(null);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [expandedServices, setExpandedServices] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const { Id, transactionDate, status, idTransaction } = location.state;
  useEffect(() => {
    console.log("Transaction ID:", idTransaction);
    if (!idTransaction) {
      console.error("Transaction ID is missing");
      return;
    }

    const fetchTransaction = async () => {
      try {
        const data = await TransactionService.getTransactionById(idTransaction);
        setTransaction(data || {});
        console.log("Transaction data:", data);
      } catch (error) {
        console.error("Error fetching transaction:", error);
      }
    };

    const fetchServiceUsages = async () => {
      try {
        const data =
          await ServiceUsageService.getServiceUsagesByClientStatusAndDate(
            Id,
            status,
            transactionDate
          );
        console.log("Fetched service usages:", data);
        setServiceUsages(data?.$values || []);
      } catch (error) {
        console.error("Error fetching service usages:", error);
      }
    };

    const fetchEmployees = async () => {
      try {
        const data = await EmployeeService.getEmployeesByClientId(Id);
        console.log("Fetched employees:", data);
        setEmployees(data || []);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };

    fetchTransaction();
    fetchServiceUsages();
    fetchEmployees();
  }, [Id, transactionDate, status, idTransaction]);

  const fetchServiceDetails = async (idService) => {
    try {
      if (!servicesDetails[idService]) {
        const service = await ServicesService.getServiceById(idService);
        console.log(
          "Fetched service details for idService:",
          idService,
          service
        );
        setServicesDetails((prev) => ({ ...prev, [idService]: service }));
      }
    } catch (error) {
      console.error("Error fetching service by ID:", error);
    }
  };

  const getEmployeeDetails = (idEmployee) => {
    const employee = employees.find(
      (employee) => employee.idEmployee === idEmployee
    );
    console.log(
      "Fetched employee details for idEmployee:",
      idEmployee,
      employee
    );
    return employee;
  };

  const groupServiceUsages = () => {
    const grouped = {};
    serviceUsages.forEach((usage) => {
      const key = `${usage.Id}-${usage.idService}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(usage);
    });
    return grouped;
  };

  const groupedServiceUsages = groupServiceUsages();

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handleBack = () => navigate(`/client/Profile/${Id}`);

  return (
    <div className="container my-4">
      <h3>Payment Information</h3>
      <p>
        <strong>User ID:</strong> {Id}
      </p>
      <p>
        <strong>Payment Date:</strong>{" "}
        {new Date(transaction?.transactionDate).toLocaleDateString() || "N/A"}
      </p>
      <p>
        <strong>Status:</strong> {status}
      </p>
      <p>
        <strong>Amount:</strong> ${transaction?.amount?.toFixed(2) || "0.00"}
      </p>
      <p>
        <strong>Payment Method:</strong> {transaction?.paymentMethod || "N/A"}
      </p>

      <h4>Services and Employees</h4>
      <table className="table table-striped table-bordered">
        <thead className="table-dark">
          <tr>
            <th>Service</th>
            <th>Price</th>
            <th>Employee Count</th>
            <th>Employees</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(groupedServiceUsages).length > 0 ? (
            Object.entries(groupedServiceUsages).map(([key, usages]) => {
              const serviceDetails = servicesDetails[usages[0].idService];
              if (!serviceDetails) {
                fetchServiceDetails(usages[0].idService); // Fetch details if not loaded yet
              }
              const totalAmount = serviceDetails?.price * usages.length;

              return (
                <React.Fragment key={key}>
                  <tr>
                    <td>{serviceDetails?.nameService || "N/A"}</td>
                    <td>${serviceDetails?.price?.toFixed(2) || "0.00"}</td>
                    <td>{usages.length}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-secondary"
                        onClick={() =>
                          toggleServiceDetails(usages[0].idService)
                        }
                      >
                        {expandedServices[usages[0].idService] ? "▼" : "▲"}
                      </button>
                    </td>
                  </tr>
                  {expandedServices[usages[0].idService] && (
                    <tr>
                      <td colSpan="4">
                        <strong>Service:</strong>{" "}
                        {serviceDetails?.nameService || "N/A"}
                        <br />
                        <strong>Price:</strong> $
                        {serviceDetails?.price?.toFixed(2) || "0.00"}
                        <br />
                        <strong>Employees Count:</strong> {usages.length}
                        <br />
                        {usages.map((usage) => {
                          const employeeDetails = getEmployeeDetails(
                            usage.idEmployee
                          );
                          return (
                            <div key={usage.idEmployee}>
                              <strong>Employee:</strong>{" "}
                              {employeeDetails?.name || "N/A"} (
                              {employeeDetails?.position || "N/A"})
                              <br />
                              <strong>Usage Date:</strong>{" "}
                              {new Date(usage.usageDate).toLocaleDateString()}
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
              <td colSpan="4" className="text-center">
                No service usages available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <button className="btn btn-primary" onClick={handleBack}>
        Back to Payment
      </button>
    </div>
  );
};

export default ProfileTransactionDetail;
