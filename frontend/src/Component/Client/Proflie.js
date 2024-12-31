import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { getAccessTokenData } from "../AuthStore";
import UserService from "../Service/UserService";
import EmployeePage from "./EmployeePage";
import ManegeTransaction from "./ManegeTransaction";

const ProfilePage = () => {
    const { Id } = useParams()
    const navigate = useNavigate();
    const [selectedView, setSelectedView] = useState("transaction");
    const [user, setUser] = useState();

    const getUser = async (userId) => {
        const user = await UserService.getUserById(userId)
        if (!user) {
            toast.error("No User")
            return;
        }
        setUser(user);
        return;
    }
    useEffect(() => {
        getUser(Id)

    }, [Id])
    return (
        <div className="container my-4">
            {/* Client Information Section */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h2 className="card-title">Client Information</h2>
                    <p>ID: {user?.id || "null"}</p>
                    <p>Name: {`${user?.firstName} ${user?.lastName}`}</p>
                    <p>Email: {user?.email}</p>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="btn-group mb-4" role="group" aria-label="Navigation">
                <button
                    className={`btn ${selectedView === "employee" ? "btn-primary" : "btn-outline-primary"
                        }`}
                    onClick={() => setSelectedView("employee")}
                >
                    Manage Employee
                </button>
                <button
                    className={`btn ${selectedView === "transaction"
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
                    onClick={() => navigate(`/client/Transaction/${Id}`)}
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
