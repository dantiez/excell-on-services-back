import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import ServiceUsageService from "../Service/serviceUsageService";
import EmployeeService from "../Service/EmployeeService";
import ServicesService from "../Service/ServicesService";

const TransactionDetailPage = () => {
    const [serviceUsages, setServiceUsages] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [servicesDetails, setServicesDetails] = useState({});
    const [expandedServices, setExpandedServices] = useState({});
    const navigate = useNavigate();
    const location = useLocation();
    const { Id } = location.state;

    useEffect(() => {
        const fetchServiceUsages = async () => {
            try {
                const data =
                    await ServiceUsageService.getServiceUsagesByClientStatusAndDate(
                        Id,
                        "not yet paid",
                        null // No transaction date needed
                    );
                setServiceUsages(data?.$values || []);
            } catch (error) {
                console.error("Error fetching service usages:", error);
            }
        };

        const fetchEmployees = async () => {
            try {
                const data = await EmployeeService.getEmployeesByClientId(Id);
                setEmployees(data || []);
            } catch (error) {
                console.error("Error fetching employees:", error);
            }
        };

        fetchServiceUsages();
        fetchEmployees();
    }, [Id]);

    const fetchServiceDetails = async (idService) => {
        try {
            if (!servicesDetails[idService]) {
                const service = await ServicesService.getServiceById(idService);
                setServicesDetails((prev) => ({
                    ...prev,
                    [idService]: service,
                }));
            }
        } catch (error) {
            console.error("Error fetching service details:", error);
        }
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

    const handleBack = () => navigate(`/client/Transaction/${Id}`);

    const getEmployeeDetails = (idEmployee) => {
        return employees.find((employee) => employee.idEmployee === idEmployee);
    };

    return (
        <div className="container my-4">
            <h3>Payment Detail (Status: Not Yet Paid)</h3>
            <p>
                <strong>Client ID:</strong> {Id}
            </p>
            <h4>Services and Employees</h4>
            <table className="table table-striped table-bordered">
                <thead className="table-dark">
                    <tr>
                        <th>Service</th>
                        <th>Total Amount</th> {/* Changed from "Price" to "Total Amount" */}
                        <th>Employee Count</th>
                        <th>Employees</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(groupedServiceUsages).length > 0 ? (
                        Object.entries(groupedServiceUsages).map(([key, usages]) => {
                            const serviceDetails = servicesDetails[usages[0].idService];
                            if (!serviceDetails) {
                                fetchServiceDetails(usages[0].idService);
                            }

                            const totalAmount = (serviceDetails?.price || 0) * usages.length; // Calculating total amount

                            return (
                                <React.Fragment key={key}>
                                    <tr>
                                        <td>{serviceDetails?.nameService || "N/A"}</td>
                                        <td>${totalAmount.toFixed(2) || "0.00"}</td>{" "}
                                        {/* Display total amount */}
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
                                                {serviceDetails?.nameService || "N/A"} <br />
                                                <strong>Price:</strong> $
                                                {serviceDetails?.price?.toFixed(2) || "0.00"} <br />
                                                <strong>Employee Count:</strong> {usages.length} <br />
                                                {usages.map((usage) => {
                                                    const employeeDetails = getEmployeeDetails(
                                                        usage.idEmployee
                                                    );
                                                    return (
                                                        <div key={usage.idEmployee}>
                                                            <strong>Employee:</strong>{" "}
                                                            {employeeDetails?.name || "N/A"} (
                                                            {employeeDetails?.position || "N/A"}) <br />
                                                            <strong>Usage Date:</strong>{" "}
                                                            {new Date(usage.usageDate).toLocaleDateString()}{" "}
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

export default TransactionDetailPage;
