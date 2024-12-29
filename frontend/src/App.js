import React from "react";
import {
  Routes,
  Route,
  BrowserRouter as Router,
  Navigate,
} from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaction from "./Component/Client/Transaction";
import TransactionDetails from "./Component/Client/TransactionDetails";
import TransactionPage from "./Component/Admin/Transaction";
import TransactionDetailPage from "./Component/Admin/TransactionDetail";
import ManegeTransaction from "./Component/Client/ManegeTransaction";
import ProfileTransactionDetail from "./Component/Client/ProfileTransactionDetail";
import ServicesPage from "./Component/Admin/ServicesPage";
import CreateAndUpdateServicePage from "./Component/Admin/CreateAndUpdateServicePage";
import EmployeePage from "./Component/Client/EmployeePage";
import CreateAndUpdateEmployeePage from "./Component/Client/CreateAndUpdateEmployeePage";
import Home from "./Component/Client/Home";
import ProfilePage from "./Component/Client/Proflie";
import Dashboard from "./Component/Admin/DashBoard";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "./Component/Layouts/DefaultLayout";
import Login from "./Component/Auth/Login";
import Register from "./Component/Auth/Register";
import AboutUsPage from "./Component/Client/Aboutus";
import ContactPage from "./Component/Client/ContactPage";
function App() {
  return (
    <MantineProvider>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route>
            <Route path="/" element={<Navigate to="/Home" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          {/* Client */}
          <Route element={<DefaultLayout />}>
            <Route path="/Home" element={<Home />} />
            <Route path="/AboutUs" element={<AboutUsPage />} />
            <Route path="/Contact" element={<ContactPage />} />
            <Route path="/Transaction/:Id" element={<Transaction />} />
            <Route path="/TransactionDetail" element={<TransactionDetails />} />
            <Route path="/Profile/:Id" element={<ProfilePage />} />
            <Route
              path="/Profile-Transaction-Detail"
              element={<ProfileTransactionDetail />}
            />
            <Route
              path="/ManegeTransaction/:Id"
              element={<ManegeTransaction />}
            />
            <Route path="/employees/:Id" element={<EmployeePage />} />
            <Route
              path="/create-update-employee/:Id/:employeeId?"
              element={<CreateAndUpdateEmployeePage />}
            />
          </Route>

          {/* Admin */}
          <Route path="/Transaction-admin" element={<TransactionPage />} />
          <Route
            path="/Transaction-detail-admin"
            element={<TransactionDetailPage />}
          />
          <Route path="/services" element={<ServicesPage />} />
          <Route
            path="/services/create"
            element={<CreateAndUpdateServicePage />}
          />
          <Route
            path="/services/update/:id"
            element={<CreateAndUpdateServicePage />}
          />

          <Route path="/Dashboard" element={<Dashboard />} />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
