import { useContext } from "react";
import { AuthContext } from "../App";
import Navbar from "./Header";
import UserTable from "./UserTable";
import AdminTable from "./AdminTable";

const Home = () => {
  const { newUser } = useContext(AuthContext);
  // axios.defaults.withCredentials = true;
  return (
    <div>
      <Navbar />
      {newUser?.role === "user" ? <UserTable /> : <AdminTable />}
    </div>
  );
};

export default Home;
