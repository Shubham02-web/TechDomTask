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
import { base_url } from "./config";
// import "react-toastify/dist/ReactToastify.css";
export const AuthContext = createContext();

function App() {
  const [newUser, setNewUser] = useState(null); // Initialize newUser as null initially
  const [token, setToken] = useState(null); // Initialize token as null initially
  const fetchUser = async (token) => {
    try {
      const userDetails = await axios.get(`${base_url}/api/user/viewuser`);
      console.log(userDetails);
      setNewUser(userDetails?.data?.newUser);
      setToken(token);
    } catch (err) {
      
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
      setNewUser(null);
      setToken(null);
    }
  }, []);

  const router = createBrowserRouter([
    {
      path: "/",
      element: newUser ? <Home /> : <Login />,
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
      element: newUser ? <CreateLoan /> : <Login />,
    },
  ]);

  return (
    <>
      <AuthContext.Provider
        value={{
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
