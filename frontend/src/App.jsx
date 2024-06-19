import { createContext, useEffect, useState } from "react";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateLoan from "./components/CreateLoan";
import axios from "axios";
import "rsuite/dist/rsuite.min.css";
import "./App.css";

export const AuthContext = createContext();

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [newUser, setNewUser] = useState(null); // Initialize newUser as null initially
  const [token, setToken] = useState(null); // Initialize token as null initially

  // eslint-disable-next-line no-unused-vars
  const navigate = (path) => {
    window.location.pathname = path;
  };

  axios.defaults.withCredentials = true;
  const fetchUser = async (token) => {
    try {
      console.log(token);
      const userDetails = await axios.get(
        "http://localhost:5000/api/user/viewuser"
      );
      console.log(userDetails.data.role);
      if (!userDetails.data) throw new Error("No user found");
      setNewUser(userDetails.data.newUser);
      setToken(token);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      // Handle error, e.g., redirect to login page if token is invalid or user not found
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
        <RouterProvider router={router} />
      </AuthContext.Provider>
    </>
  );
}

export default App;
