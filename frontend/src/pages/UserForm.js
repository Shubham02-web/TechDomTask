// Import Necessary Modules
import React, { useState } from "react";
import axios, { Axios, AxiosError } from "axios";

const UserForm = () => {
  // state for  User Name
  const [name, setName] = useState("");
  //   state for mobile
  const [mobile, setMobile] = useState("");
  //   state for password
  const [password, setPassword] = useState("");

  //   creating Handles for submission
  const handleSubmit = async (e) => {
    // prevent default submision
    e.preventDefault();
    // Validate amount and term
    try {
      // making Post request to crete Loan
      const response = await axios.post(
        "http://localhost:5000/api/user/create",
        {
          name,
          mobile,
          password,
        }
      );
      //   Showing an message for Sucessfully creation of loan
      if (response.data) alert(response.data.message);
    } catch (error) {
      if (error.name === "AxiosError")
        return alert(error.response.data.message);
      console.error(error.response.data.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4"> User Registration </h2>{" "}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <label className="block mb-2">
          Name:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <label className="block mb-2">
          mobile:
          <input
            type="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <label className="block mb-2">
          password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
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

export default UserForm;
