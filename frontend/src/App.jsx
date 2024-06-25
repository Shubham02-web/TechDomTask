import { createContext, useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateLoan from "./components/CreateLoan";
import axios from "axios";
import "rsuite/dist/rsuite.min.css";
import "./App.css";
import ToastContainer from "rsuite/esm/toaster/ToastContainer";
import "react-toastify/dist/ReactToastify.css";
import dotenv from "dotenv";
dotenv.config();
export const AuthContext = createContext();

console.log(process.env.REACT_APP_HOST_URL);
function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [newUser, setNewUser] = useState(null); // Initialize newUser as null initially
  const [token, setToken] = useState(null); // Initialize token as null initially
  const fetchUser = async (token) => {
    try {
      const userDetails = await axios.get(
        `${process.env.REACT_APP_HOST_URL}/api/user/viewuser`
      );

      setNewUser(userDetails?.data?.newUser);
      setToken(token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert(`invalid token or user not found\n ${err.response.data.message}`);
      setLoggedIn(false);
      setNewUser(null);
      setToken(null);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUser(token);
    } else {
      // If no token found, handle accordingly (e.g., redirect to login page)
      setLoggedIn(false);
      setNewUser(null);
      setToken(null);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: isLoggedIn ? <Home /> : <Login />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/CreateLoan",
      element: isLoggedIn ? <CreateLoan /> : <Login />,
    },
  ]);

  return (
    <>
      <AuthContext.Provider
        value={{
          isLoggedIn,
          setLoggedIn,
          newUser,
          setNewUser,
          token,
          setToken,
        }}
      >
        <ToastContainer />
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
