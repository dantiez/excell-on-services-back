import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAccessToken, getAccessTokenData } from "../../AuthStore";
import { AuthService } from "../../Service/AuthService";
import "./AdminHeader.css"; // Import CSS file

const AdminHeader = () => {
    const location = useLocation();
    // Get the current path
    const navigate = useNavigate()
    const token = getAccessToken();
    const tokenData = getAccessTokenData()
    const handleLogout = async () => {
        await AuthService.logout(token, tokenData?.nameid)
        navigate("/login");
    }


    return (
        <nav className="navbar d-flex flex-column p-3">
            {/* Title at the top */}
            <div className="navbar-brand">Admin Panel</div>

            {/* List of links */}
            <ul className="nav flex-column w-100">
                <li className="nav-item mb-2">
                    <Link
                        className={`nav-link ${location.pathname === "Dashboard" ? "active" : ""
                            }`}
                        to="/Dashboard"
                    >
                        Dashboard
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link
                        className={`nav-link ${location.pathname === "manager-user" ? "active" : ""
                            }`}
                        to="/manager-user"
                    >
                        Manager User
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link
                        className={`nav-link ${location.pathname === "services" ? "active" : ""
                            }`}
                        to="/services"
                    >
                        Service
                    </Link>
                </li>
            </ul>

            {/* Logout link remains at the bottom */}
            <div>
                <ul className="nav flex-column w-100">
                    <li className="nav-item">
                        <Link
                            className={`nav-link ${location.pathname === "logout" ? "active" : ""
                                }`}
                            onClick={() => handleLogout()}
                        >
                            Logout
                        </Link>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default AdminHeader;
