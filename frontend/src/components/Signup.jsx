import { useContext, useState } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { setLoggedIn, setToken, setNewUser } = useContext(AuthContext);

  axios.defaults.withCredentials = true;
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      e.preventDefault();
      if (!name || !password || !mobile) throw "Please fill all fields!";

      const responese = await axios.post(
        "http://localhost:5000/api/user/create",
        {
          name,
          password,
          mobile,
        }
      );
      setNewUser(responese.newUser);
      setToken(responese.token);
      setLoggedIn(true);
      localStorage.setItem("token", responese.token);
      navigate("/");
    } catch (error) {
      if (error.name === "AxiosError") {
        console.log(error.response.data.message);
        return alert(error.response.data.message);
      }
      console.error(error);
      alert(`Can't create account!\nError: ${error.response}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md w-full md:w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Name:
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Mobile:
            </label>
            <input
              type="number"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">
              Password:
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 p-2 w-full border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:border-blue-700 focus:ring focus:ring-blue-200"
          >
            Signup
          </button>
        </form>
        <div className="mt-4">
          <a
            href="/login"
            className="text-blue-500 hover:text-blue-700 focus:outline-none focus:underline"
          >
            Already have an account?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Signup;
