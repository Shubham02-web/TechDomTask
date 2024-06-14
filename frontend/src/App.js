// Importing Neccessary Modules
import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import LoanForm from "./pages/LoanForm";
import LoanList from "./pages/LoanList";

const App = () => {
  return (
    <Router>
      <nav>
        <ul>
          <li>
            <Link to="/"> Create Loan </Link>{" "}
            <Link to="/loans"> view Loans </Link>{" "}
            {/* <link to="/repay"> RepayLoans </link> */}{" "}
          </li>{" "}
        </ul>{" "}
      </nav>{" "}
      <Routes>
        <Route path="/" element={<LoanForm />}>
          {" "}
        </Route>{" "}
        <Route path="/loans" element={<LoanList />}>
          {" "}
        </Route>{" "}
        {/* <Route path="/repay" element={< />}></Route> */}{" "}
      </Routes>{" "}
    </Router>
  );
};

export default App;
