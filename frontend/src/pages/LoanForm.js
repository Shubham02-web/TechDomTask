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
    // Validate amount and term
    if (amount <= 0 || term <= 0) {
      alert("Amount and term must be greater than zero");
      return;
    }
    try {
      // making Post request to crete Loan
      const response = await axios.post(
        "http://localhost:5000/api/loan/create",
        {
          amount,
          term,
          startDate,
        }
      );
      //   Showing an message for Sucessfully creation of loan
      if (response.data) alert(response.data.message);
    } catch (error) {
      console.error(error);
      //   show  erroor message
      alert("error in creating Loan");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4"> Create Loan </h2>{" "}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2">
          Amount:
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <label className="block mb-2">
          Term(weeks):
          <input
            type="number"
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <label className="block mb-2">
          Start Date:
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <button
          type="submit"
          className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
        >
          {" "}
          Submit{" "}
        </button>{" "}
      </form>{" "}
    </div>
  );
};

export default LoanForm;
