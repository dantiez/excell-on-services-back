import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PayPalIntegration from "./PayPalIntegration";
import ServiceUsageService from "../Service/serviceUsageService";

const Transaction = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { transactionId } = location.state || {};

  const [clientName, setClientName] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [amount, setAmount] = useState(0);
  const [serviceUsages, setServiceUsages] = useState([]);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [dataNotFound, setDataNotFound] = useState(false);

  useEffect(() => {
    // Fetch transaction data using transactionId
    const fetchTransactionData = async () => {
      try {
        const transactionData = await ServiceUsageService.getTransactionData(
          transactionId
        );
        if (transactionData) {
          setClientName(transactionData.clientName);
          setTransactionDate(transactionData.transactionDate);
          setPaymentMethod(transactionData.paymentMethod);
          setAmount(transactionData.amount);
          setServiceUsages(transactionData.serviceUsages);
          setEmployeeCount(transactionData.serviceUsages.length);
        } else {
          setDataNotFound(true);
        }
      } catch (error) {
        console.error("Error fetching transaction data:", error);
        setDataNotFound(true);
      }
    };

    if (transactionId) {
      fetchTransactionData();
    }
  }, [transactionId]);

  const handlePaymentSuccess = async () => {
    try {
      const updatePromises = serviceUsages.map(
        (usage) => Promise.resolve() // Simulate successful update
      );
      await Promise.all(updatePromises);

      navigate("/transaction-details", {
        state: {
          transactionId,
          clientName,
          transactionDate: new Date().toLocaleDateString(),
          paymentMethod,
          amount,
          serviceUsages,
        },
      });
    } catch (error) {
      console.error("Error updating transaction data:", error);
      alert("An error occurred while updating transaction details.");
    }
  };

  const navigateToDetails = () => {
    navigate(`/transaction/${transactionId}`);
  };

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
                  <strong>Client Name:</strong> {clientName}
                </div>
                <div className="col text-end">
                  <strong>Date:</strong> {transactionDate}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <strong>Payment Method:</strong> {paymentMethod}
                </div>
                <div className="col text-end">
                  <strong>Total Amount:</strong> ${amount.toFixed(2)}
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
                  {serviceUsages.length > 0 ? (
                    serviceUsages.map((service, index) => {
                      const users = serviceUsages.filter(
                        (usage) => usage.id_service === service.id_service
                      );
                      const uniqueUsers = new Set(
                        users.map((usage) => usage.id_employee)
                      ).size;

                      return (
                        <tr key={index}>
                          <td>{service.Service?.name_service || "N/A"}</td>
                          <td>{uniqueUsers}</td>
                          <td>
                            ${service.Service?.price?.toFixed(2) || "0.00"}
                          </td>
                          <td>${service.total_fee?.toFixed(2) || "0.00"}</td>
                        </tr>
                      );
                    })
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
                  totalAmount={amount}
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
