// Import Necessary Modules
import React, { useState } from "react";
import axios from "axios";

const LoanForm = () => {
  // state for Loan Amount
  const [amount, setAmount] = useState("");
  //   state for Loan Term
  const [term, setTerm] = useState("");
  //   state for Loan Start date
  const [startDate, setStartDate] = useState("");

  //   creating Handles for submission
  const handleSubmit = async (e) => {
    // prevent default submision
    e.preventDefault();
    try {
      // making Post request to crete Loan
      await axios.post("http://localhost:5000/api/loan/create", {
        amount,
        term,
        startDate,
      });

      //   Showing an message for Sucessfully creation of loan
      alert("Loan Created Succefully");
    } catch (error) {
      console.error(error);
      //   show  erroor message
      alert("error in creating Loan");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Amount:
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </label>{" "}
      <label>
        Term(weeks):
        <input
          type="number"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          required
        />
      </label>{" "}
      <label>
        Start Date:
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          required
        />
      </label>{" "}
      <button type="submit"> Submit </button>{" "}
    </form>
  );
};

export default LoanForm;
