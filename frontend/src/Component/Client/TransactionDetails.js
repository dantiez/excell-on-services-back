import React, { useEffect, useState } from "react";
import { Container, Table, Card, Row, Col, Button } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import ServiceUsageService from "../Service/serviceUsageService";
const TransactionDetail = () => {
  const { idClient } = useParams();
  const navigate = useNavigate();

  const [serviceUsages, setServiceUsages] = useState([]);
  const [clientInfo, setClientInfo] = useState({});
  const [totalFee, setTotalFee] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch client and service usage data based on idClient
    const fetchTransactionDetails = async () => {
      try {
        const transactionDetails =
          await ServiceUsageService.getTransactionDetails(idClient);
        if (transactionDetails) {
          setClientInfo(transactionDetails.clientInfo);
          setServiceUsages(transactionDetails.serviceUsages);
          calculateTotalFee(transactionDetails.serviceUsages);
        }
      } catch (error) {
        console.error("Error fetching transaction details:", error);
      }
    };

    fetchTransactionDetails();
  }, [idClient]);

  const calculateTotalFee = (usages) => {
    const total = usages.reduce((sum, usage) => sum + usage.total_fee, 0);
    setTotalFee(total);
  };

  const totalPages = Math.ceil(serviceUsages.length / itemsPerPage);
  const currentItems = serviceUsages.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleBackClick = () => {
    navigate("/Transaction");
  };

  return (
    <Container className="my-5">
      <Row>
        <Col>
          <Card>
            <Card.Header>
              <Button variant="secondary" onClick={handleBackClick}>
                &lt; Back to Transactions
              </Button>
              <h3 className="text-center">Transaction Details</h3>
            </Card.Header>
            <Card.Body>
              <h4>Client Information</h4>
              <Table striped bordered responsive>
                <tbody>
                  <tr>
                    <td>Name</td>
                    <td>{clientInfo.name_Client}</td>
                  </tr>
                  <tr>
                    <td>Phone Number</td>
                    <td>{clientInfo.phone_number}</td>
                  </tr>
                  <tr>
                    <td>Email</td>
                    <td>{clientInfo.email}</td>
                  </tr>
                </tbody>
              </Table>

              <h4>Service Usage</h4>
              <Table striped bordered responsive>
                <thead>
                  <tr>
                    <th>Service Name</th>
                    <th>Total Fee</th>
                    <th>Status</th>
                    <th>Employee Name</th>
                    <th>Usage Date</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((usage) => (
                    <tr key={usage.id_service_usage}>
                      <td>{usage.Service?.name_service || "N/A"}</td>
                      <td>{usage.total_fee}</td>
                      <td>{usage.status}</td>
                      <td>{usage.employee_name}</td>
                      <td>{usage.usage_date}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between">
                <div>
                  <h5>Total Fee: {totalFee}</h5>
                </div>
                <div>
                  {[...Array(totalPages)].map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        currentPage === index + 1 ? "primary" : "secondary"
                      }
                      onClick={() => handlePageChange(index + 1)}
                      className="mx-1"
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default TransactionDetail;
