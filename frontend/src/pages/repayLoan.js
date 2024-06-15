// Import neccessary Modules
import React, { useState } from "react";
import axios from "axios";

const RepayLoans = () => {
  const [loanId, setLoanId] = useState("");
  const [amount, setAmount] = useState("");

  //   Handle For Submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (amount <= 0) {
        alert("amount for repayment must be grater then 1");
        return;
      }
      // Make Post Request to repay Loan
      const response = await axios.post(
        `http://localhost:5000/api/loan/repayment/${loanId}`,
        {
          amount,
        }
      );
      // alert("Repayment Succesfuly");
      alert(response.data.message);
    } catch (error) {
      if (error.name === "AxiosError")
        return alert(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Loan ID:
        <input
          type="text"
          value={loanId}
          onChange={(e) => setLoanId(e.target.value)}
          required
        />
      </label>{" "}
      <label>
        Repayment Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>{" "}
      <button type="submit"> Submit </button>{" "}
    </form>
  );
};

export default RepayLoans;
