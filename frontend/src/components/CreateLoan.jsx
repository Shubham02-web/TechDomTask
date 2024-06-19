import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateLoan = () => {
  const [amount, setAmount] = useState("");
  const [term, setTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;
  const handleFormSubmit = async (e) => {
    try {
      e.preventDefault();
      if (!amount || !term || !startDate) throw "Fill all details!";
      await axios.post("http://localhost:5000/api/loan/create", {
        amount,
        term,
        startDate,
      });
      alert("Loan creation successful!");
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        console.error(error.response.data.message);
        return alert(error.response.data.message);
      }
      console.error(error);
      alert(`Can't create the loan!\nError: ${error}`);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="CreateLoan max-w-md mx-auto mt-10">
      <div>
        <h2 className="text-2xl font-bold mb-4">Loan Application Form</h2>
        <form
          onSubmit={handleFormSubmit}
          className="bg-white p-6 rounded shadow-md"
        >
          <label className="block mb-2">
            Amount:
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
            Terms:
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
            startDate:
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
      </div>
    </div>
  );
};

export default CreateLoan;
