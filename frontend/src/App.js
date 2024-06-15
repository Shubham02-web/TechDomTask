// Importing Neccessary Modules
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoanForm from "./pages/LoanForm";
import LoanList from "./pages/LoanList";
import RepayLoans from "./pages/repayLoan";
import "./App.css";

const App = () => {
  return (
    <Router>
      <div className="app-container">
        <nav className="bg-blue-500 p-4">
          <ul className="flex justify-center space-x-4">
            <li>
              <Link to="/" className="text-white hover:underline">
                {" "}
                Create Loan{" "}
              </Link>{" "}
              <Link to="/loans" className="text-white hover:underline">
                {" "}
                view Loans{" "}
              </Link>{" "}
              <Link to="/repay" className="text-white hover:underline">
                {" "}
                RepayLoans{" "}
              </Link>{" "}
            </li>{" "}
          </ul>{" "}
        </nav>{" "}
        <div className="content">
          <Routes>
            <Route path="/" element={<LoanForm />}>
              {" "}
            </Route>{" "}
            <Route path="/loans" element={<LoanList />}>
              {" "}
            </Route>{" "}
            <Route path="/repay" element={<RepayLoans />}>
              {" "}
            </Route>{" "}
          </Routes>{" "}
        </div>{" "}
      </div>{" "}
    </Router>
  );
};

export default App;
