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
import "@mantine/core/styles.layer.css";
import "mantine-datatable/styles.layer.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "../src/Component/Layouts/DefaultLayout";
import Register from "../src/Component/Auth/Register";
import AboutUsPage from "../src/Component/Client/Aboutus";
import ContactPage from "../src/Component/Client/ContactPage";
import { Toaster } from "sonner";
import { Login } from "./Component/Auth/Login";
import AdminHeader from "./Component/Layouts/HeaderAdmin/AdminHeader";
import {
  getAccessToken,
  getAccessTokenData,
  getUserData,
} from "./Component/AuthStore";
import { PrivateRoute } from "./Component/Auth/PrivateRoute";
import { ManageUser } from "./Component/Admin/ManageUser";
import { AdminLayout } from "./Component/Layouts/AdminLayout";
import { ModalsProvider } from "@mantine/modals";
function App() {
  const tokenData = getAccessTokenData();
  const userData = getUserData();
  const basicRoute =
    tokenData && userData
      ? !userData.active
        ? "/client/Home"
        : "/admin/Dashboard"
      : "/login";
  return (
    <MantineProvider>
      <Toaster richColors />
      <ModalsProvider>
        <Router>
          <Routes>
            {/* Default Route */}
            <Route
              path="/"
              element={<Navigate to={`${basicRoute}`} replace />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Client */}
            <Route path="/client" element={<DefaultLayout />}>
              <Route
                path="Home"
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path="AboutUs"
                element={
                  <PrivateRoute>
                    <AboutUsPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="Contact"
                element={
                  <PrivateRoute>
                    <ContactPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="Transaction/:Id"
                element={
                  <PrivateRoute>
                    <Transaction />
                  </PrivateRoute>
                }
              />
              <Route
                path="TransactionDetail"
                element={
                  <PrivateRoute>
                    <TransactionDetails />
                  </PrivateRoute>
                }
              />
              <Route
                path="Profile/:Id"
                element={
                  <PrivateRoute>
                    <ProfilePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="Profile-Transaction-Detail"
                element={
                  <PrivateRoute>
                    <ProfileTransactionDetail />
                  </PrivateRoute>
                }
              />
              <Route
                path="ManegeTransaction/:Id"
                element={
                  <PrivateRoute>
                    <ManegeTransaction />
                  </PrivateRoute>
                }
              />
              <Route
                path="employees/:Id"
                element={
                  <PrivateRoute>
                    <EmployeePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="create-update-employee/:Id/:employeeId?"
                element={
                  <PrivateRoute>
                    <CreateAndUpdateEmployeePage />
                  </PrivateRoute>
                }
              />
            </Route>

            {/* Admin */}
            <Route
              path="/admin"
              element={
                <>
                  <AdminLayout />
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
                element={
                  <PrivateRoute isAdmin={true}>
                    <TransactionDetailPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="services"
                element={
                  <PrivateRoute isAdmin={true}>
                    <ServicesPage />
                  </PrivateRoute>
                }
              />
              <Route
                path="services/create"
                element={
                  <PrivateRoute isAdmin={true}>
                    <CreateAndUpdateServicePage />
                  </PrivateRoute>
                }
              />
              <Route
                path="services/update/:id"
                element={
                  <PrivateRoute isAdmin={true}>
                    <CreateAndUpdateServicePage />
                  </PrivateRoute>
                }
              />

              <Route
                path="Dashboard"
                element={
                  <PrivateRoute isAdmin={true}>
                    <Dashboard />
                  </PrivateRoute>
                }
              />
              <Route
                path="manage-user"
                element={
                  <PrivateRoute isAdmin={true}>
                    <ManageUser />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Router>
      </ModalsProvider>
    </MantineProvider>
  );
}

export default App;
