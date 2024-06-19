import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const { setNewUser, setToken, setLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  axios.defaults.withCredentials = true;
  const handleLogin = async (e) => {
    try {
      e.preventDefault();
      if (!name || !mobile) throw "Please fill all fields!";
      const response = await axios.post(
        "http://localhost:5000/api/user/login",
        {
          name,
          mobile,
        }
      );
      setNewUser(response.user);
      setToken(response.token);
      setLoggedIn(true);
      localStorage.setItem("token", response.token);
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        console.log(error.response.data.message);
        return alert(error.response.data.message);
      }
      console.error(error);
      alert(`Can't login!\nError: ${error}`);
    }
  };
  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4"> Login </h2>{" "}
      <form onSubmit={handleLogin} className="bg-white p-6 rounded shadow-md">
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
          Mobile:
          <input
            type="number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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
        <a
          href="/Signup"
          className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
        >
          new User register here?
        </a>
      </div>
    </div>
  );
};
export default Login;
