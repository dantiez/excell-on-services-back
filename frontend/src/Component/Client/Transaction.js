import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PayPalIntegration from "./PayPalIntegration";
import ServiceUsageService from "../Service/serviceUsageService";
import ServicesService from "../Service/ServicesService";
import EmployeeService from "../Service/EmployeeService";

const Transaction = () => {
  const navigate = useNavigate();

  const [serviceUsages, setServiceUsages] = useState([]);
  const [servicesDetails, setServicesDetails] = useState({});
  const [employees, setEmployees] = useState([]);
  const [expandedServices, setExpandedServices] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [dataNotFound, setDataNotFound] = useState(false);

  useEffect(() => {
    const fetchTransactionData = async () => {
      try {
        // Fetch service usages
        const usages =
          await ServiceUsageService.getServiceUsagesByClientStatusAndDate(
            1, // Fixed clientId
            "not yet paid",
            null
          );
        if (usages?.$values?.length > 0) {
          setServiceUsages(usages.$values);

          // Fetch service details
          const serviceIds = [
            ...new Set(usages.$values.map((u) => u.idService)),
          ];
          const services = await Promise.all(
            serviceIds.map((id) => ServicesService.getServiceById(id))
          );
          const serviceDetailsMap = services.reduce((acc, service) => {
            acc[service.idService] = service;
            return acc;
          }, {});
          setServicesDetails(serviceDetailsMap);

          // Fetch employee details
          const employeeData = await EmployeeService.getEmployeesByClientId(1); // Fixed clientId
          setEmployees(employeeData || []);

          // Calculate total amount and employee count
          const amount = usages.$values.reduce(
            (sum, usage) =>
              sum + (serviceDetailsMap[usage.idService]?.price || 0),
            0
          );
          setTotalAmount(amount);
          setEmployeeCount(usages.$values.length);
        } else {
          setDataNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setDataNotFound(true);
      }
    };

    fetchTransactionData();
  }, []);

  const toggleServiceDetails = (serviceId) => {
    setExpandedServices((prev) => ({
      ...prev,
      [serviceId]: !prev[serviceId],
    }));
  };

  const handlePaymentSuccess = async () => {
    // Logic to handle payment success (similar to your existing implementation)
    alert("Payment processed successfully!");
  };

  const navigateToDetails = () => {
    navigate("/TransactionDetail", {
      state: { clientId: 1 },
    });
  };

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

  const groupedServiceUsages = groupServiceUsages();

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5>Transaction Receipt</h5>
              <button
                className="btn btn-primary btn-sm"
                onClick={navigateToDetails}
              >
                Transaction Details
              </button>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col">
                  <strong>Payment Method:</strong> PayPal
                </div>
                <div className="col text-end">
                  <strong>Total Amount:</strong> ${totalAmount.toFixed(2)}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <strong>Number of Employees Using Services:</strong>{" "}
                  {employeeCount}
                </div>
              </div>

              <h6>Services Used</h6>
              <table className="table table-bordered">
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Number of Users</th>
                    <th>Service Price</th>
                    <th>Total Fee</th>
                  </tr>
                </thead>
                <tbody>
                  {groupedServiceUsages &&
                  Object.keys(groupedServiceUsages).length > 0 ? (
                    Object.entries(groupedServiceUsages).map(
                      ([key, usages]) => {
                        const serviceDetails =
                          servicesDetails[usages[0].idService];
                        const uniqueUsers = new Set(
                          usages.map((usage) => usage.idEmployee)
                        ).size;
                        const totalFee =
                          (serviceDetails?.price || 0) * usages.length;

                        return (
                          <React.Fragment key={key}>
                            <tr>
                              <td>{serviceDetails?.nameService || "N/A"}</td>
                              <td>{uniqueUsers}</td>
                              <td>
                                ${serviceDetails?.price?.toFixed(2) || "0.00"}
                              </td>
                              <td>${totalFee.toFixed(2)}</td>
                            </tr>
                            {expandedServices[usages[0].idService] && (
                              <tr>
                                <td colSpan="4">
                                  <strong>Service:</strong>{" "}
                                  {serviceDetails?.nameService || "N/A"} <br />
                                  <strong>Price:</strong> $
                                  {serviceDetails?.price?.toFixed(2) || "0.00"}{" "}
                                  <br />
                                  <strong>Employees:</strong>
                                  <ul>
                                    {usages.map((usage) => {
                                      const employee = employees.find(
                                        (e) => e.idEmployee === usage.idEmployee
                                      );
                                      return (
                                        <li key={usage.idEmployee}>
                                          {employee?.name || "N/A"} (
                                          {employee?.position || "N/A"})
                                        </li>
                                      );
                                    })}
                                  </ul>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        );
                      }
                    )
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center">
                        No services used.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              <div className="justify-content-between">
                <PayPalIntegration
                  totalAmount={totalAmount}
                  handlePaymentSuccess={handlePaymentSuccess}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transaction;
