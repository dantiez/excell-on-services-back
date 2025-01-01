import React from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
  Outlet,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaction from "../src/Component/Client/Transaction";
import TransactionDetails from "../src/Component/Client/TransactionDetails";
import TransactionPage from "../src/Component/Admin/Transaction";
import TransactionDetailPage from "../src/Component/Admin/TransactionDetail";
import ManegeTransaction from "../src/Component/Client/ManegeTransaction";
import ProfileTransactionDetail from "../src/Component/Client/ProfileTransactionDetail";
import ServicesPage from "../src/Component/Admin/ServicesPage";
import CreateAndUpdateServicePage from "../src/Component/Admin/CreateAndUpdateServicePage";
import EmployeePage from "../src/Component/Client/EmployeePage";
import CreateAndUpdateEmployeePage from "../src/Component/Client/CreateAndUpdateEmployeePage";
import Home from "../src/Component/Client/Home";
import ProfilePage from "../src/Component/Client/Proflie";
import Dashboard from "../src/Component/Admin/DashBoard";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "../src/Component/Layouts/DefaultLayout";
import Register from "../src/Component/Auth/Register";
import AboutUsPage from "../src/Component/Client/Aboutus";
import ContactPage from "../src/Component/Client/ContactPage";
import { Toaster } from "sonner";
import { Login } from "./Component/Auth/Login";
import AdminHeader from "./Component/Layouts/HeaderAdmin/AdminHeader";
import { getAccessToken, getAccessTokenData } from "./Component/AuthStore";
import { PrivateRoute } from "./Component/Auth/PrivateRoute";
function App() {
  const tokenData = getAccessTokenData();

  const basicRoute = tokenData
    ? tokenData.isAdmin
      ? "/client/Home"
      : "/admin/Dashboard"
    : "/login";
  return (
    <MantineProvider>
      <Toaster richColors />
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<Navigate to={`${basicRoute}`} replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* Client */}
          <Route path="/client" element={<DefaultLayout />}>
            <Route path="Home" element={<Home />} />
            <Route path="AboutUs" element={<AboutUsPage />} />
            <Route path="Contact" element={<ContactPage />} />
            <Route path="Transaction/:Id" element={<Transaction />} />
            <Route path="TransactionDetail" element={<TransactionDetails />} />
            <Route path="Profile/:Id" element={<ProfilePage />} />
            <Route
              path="Profile-Transaction-Detail"
              element={<ProfileTransactionDetail />}
            />
            <Route
              path="ManegeTransaction/:Id"
              element={<ManegeTransaction />}
            />
            <Route path="employees/:Id" element={<EmployeePage />} />
            <Route
              path="create-update-employee/:Id/:employeeId?"
              element={<CreateAndUpdateEmployeePage />}
            />
          </Route>

          {/* Admin */}
          <Route
            path="/admin"
            element={
              <>
                <Outlet />
              </>
            }
          >
            <Route
              path="Transaction-admin"
              element={
                <PrivateRoute isAdmin={true}>
                  <TransactionPage />
                </PrivateRoute>
              }
            />
            <Route
              path="Transaction-detail-admin"
              element={<TransactionDetailPage />}
            />
            <Route path="services" element={<ServicesPage />} />
            <Route
              path="services/create"
              element={<CreateAndUpdateServicePage />}
            />
            <Route
              path="services/update/:id"
              element={<CreateAndUpdateServicePage />}
            />

            <Route path="Dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
