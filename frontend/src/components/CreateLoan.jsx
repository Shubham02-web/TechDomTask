import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { base_url } from "../config";
import Header from "./Header";

const requestLoan = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!amount || !term || !startDate) throw "Fill all details!";
      await axios.post(`${base_url}/api/loan/create`, {
        amount,
        term,
        startDate,
      });
      alert("You have successFully requested for new Loan");
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        return alert(error.response.data.message);
      }
      alert(error.respose.data.message);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div>
      <Header />

      <div className="CreateLoan max-w-md mx-auto mt-10">
        <div>
          <h2 className="text-2xl font-bold mb-4">Loan Application Form</h2>
          <form
            onSubmit={handleFormSubmit}
            className="bg-white p-6 rounded shadow-md text-left"
          >
            <label className="block mb-2">
              Amount <span className="text-red-600">*</span>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <br />
            <label className="block mb-2">
              Terms <span className="text-red-600">*</span>
              <input
                type="number"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <br />
            <label className="block mb-2">
              Start Date <span className="text-red-600">*</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={today}
                required
                className="block w-full mt-1 p-2 border rounded"
              />
            </label>
            <button
              type="submit"
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded"
            >
              Submit
            </button>
          </form>
          {/* <div className="mt-4">
          <NavLink
            to="/"
            className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
          >
            Back To Home
          </NavLink>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default requestLoan;
