import { useContext } from "react";
import axios from "axios";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";
import Navbar from "./Header";
import UserTable from "./UserTable";
import AdminTable from "./AdminTable";

const Home = () => {
  const { newUser } = useContext(AuthContext);
  const navigate = useNavigate();
  // axios.defaults.withCredentials = true;
  return (
    <div>
      <Navbar />
      {newUser?.role === "user" ? <UserTable /> : <AdminTable />}
    </div>
  );
};

export default Home;
