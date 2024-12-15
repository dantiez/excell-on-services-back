import React from "react";
import { Routes, Route, BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import Transaction from "./Component/Client/Transaction";
import TransactionDetails from "./Component/Client/TransactionDetails";
import TransactionPage from "./Component/Admin/Transaction";
import TransactionDetailPage from "./Component/Admin/TransactionDetail";

function App() {
  return (
    <Router>
      <Routes>
        {/*Client  */}
        <Route path="/Transaction" element={<Transaction />} />
        <Route path="/transaction/:idClient" element={<TransactionDetails />} />

        {/*Admin  */}
        <Route path="/Transaction-admin" element={<TransactionPage />} />
        <Route
          path="/Transaction-detail-admin"
          element={<TransactionDetailPage />}
        />
      </Routes>
    </Router>
  );
}

export default App;
