import React, { useEffect, useState } from "react";
import axios from "axios";

const LoanList = () => {
  // States for storing Loans
  const [Loans, setLoans] = useState([]);

  useEffect(() => {
    const fetchLoans = async () => {
      try {
        // Get Request to fatch Loans
        const response = await axios.get(
          "http://localhost:5000/api/loan/AllLoan"
        );
        // Updating State with fatched Loans
        if (response.data.Loans) setLoans(response.data.Loans);
      } catch (error) {
        console.error(error);
        setLoans([]);
      }
    };
    // fatch Loans
    fetchLoans();
  }, []);

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4"> Loan List </h2>{" "}
      <ul className="bg-white p-6 rounded shadow-md">
        {" "}
        {Loans.map((loan) => (
          <li key={loan._id} className="mb-4">
            <div className="font-bold"> Amount: {loan.amount} </div>{" "}
            <div> Term: {loan.term}, Weeks </div>{" "}
            <div> State: {loan.state} </div>{" "}
            <ul className="mt-2">
              {" "}
              {loan.repayments.map((repayment, index) => (
                <li key={index} className="text-sm text-gray-700">
                  Due Date: {new Date(repayment.dueDate).toLocaleDateString()},
                  Amount: {repayment.amount}{" "}
                </li>
              ))}{" "}
            </ul>{" "}
          </li>
        ))}{" "}
      </ul>{" "}
    </div>
  );
};

export default LoanList;
