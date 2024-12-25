import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EmployeePage from "./EmployeePage";
import ManegeTransaction from "./ManegeTransaction";

const ProfilePage = () => {
  const { Id } = useParams();
  const navigate = useNavigate();
  const [selectedView, setSelectedView] = useState("transaction");

  return (
    <div className="container my-4">
      {/* Client Information Section */}
      <div className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">Client Information</h2>
          <p>ID: {Id || "null"}</p>
          <p>Name: null</p>
          <p>Email: null</p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="btn-group mb-4" role="group" aria-label="Navigation">
        <button
          className={`btn ${
            selectedView === "employee" ? "btn-primary" : "btn-outline-primary"
          }`}
          onClick={() => setSelectedView("employee")}
        >
          Manage Employee
        </button>
        <button
          className={`btn ${
            selectedView === "transaction"
              ? "btn-primary"
              : "btn-outline-primary"
          }`}
          onClick={() =>
            setSelectedView("transaction") && <ManegeTransaction Id={Id} />
          }
        >
          Manage Transaction
        </button>
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(`/Transaction/${Id}`)}
        >
          Payment
        </button>
        <button className="btn btn-outline-warning">Update Client</button>
      </div>

      {/* Content Display Section */}
      <div className="card shadow-sm">
        <div className="card-body">
          {selectedView === "employee" && <EmployeePage Id={Id} />}
          {selectedView === "transaction" && <ManegeTransaction Id={Id} />}
          {!selectedView && <p>Please select a view above.</p>}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;