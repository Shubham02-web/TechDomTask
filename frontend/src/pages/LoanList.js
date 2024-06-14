import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanList = () => {
  // States for storing Loans
  const [Loans, setLoans] = useState([]);

  useEffect(() => {
    const fatchLoans = async () => {
      try {
        // Get Request to fatch Loans
        const response = await axios.get(
          "http://localhost:5000/api/loan/AllLoan"
        );
        // Updating State with fatched Loans
        setLoans(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    // fatch Loans
    fatchLoans();
  }, []);

  return (
    <div>
      <h2> Loan Lists </h2>{" "}
      <ul>
        {" "}
        {Loans.map((loan) => (
          <li key={loan._id}>
            Amount: {loan.amount}, Term: {loan.term}
            weeks, State: {loan.state}{" "}
          </li>
        ))}{" "}
      </ul>{" "}
    </div>
  );
};

export default LoanList;
