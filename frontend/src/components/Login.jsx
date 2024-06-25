import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { base_url } from "../config";

const Login = () => {
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const { setNewUser, setToken } = useContext(AuthContext);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (!mobile || !password) throw "Please fill all fields!";
      const response = await axios.post(`${base_url}/api/user/login`, {
        mobile,
        password,
      });
      console.log(response);
      setNewUser(response.data.newUser);
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      navigate("/");
    } catch (error) {
      return alert(error.response.data.message);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-28">
      <h1 className="text-3xl font-bold mb-4">Loan Application</h1>
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md mt-10"
      >
        <h2 className="text-2xl font-bold mb-4"> Login </h2>{" "}
        <label className="block mb-5 text-start">
          Mobile <span className="text-red-600">*</span>
          <input
            type="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            required
            className="block w-full mt-1 p-2 border rounded"
          />
        </label>{" "}
        <label className="block mb-5 text-start">
          Password <span className="text-red-600">*</span>
          <input
            type="text"
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
      <div className="mt-4">
        <NavLink
          to="/Signup"
          className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
        >
          New user? Register here
        </NavLink>
      </div>
    </div>
  );
};
export default Login;
