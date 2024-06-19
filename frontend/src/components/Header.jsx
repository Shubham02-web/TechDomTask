import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Avatar } from "rsuite";
import ExitIcon from "@rsuite/icons/Exit";

import { AuthContext } from "../App";
const renderToggle = (props) => <Avatar size="sm" circle {...props} />;
const Header = () => {
  const { newUser, setLoggedIn, setNewUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear local storage and navigate to login page
    localStorage.removeItem("token");
    setLoggedIn(false);
    setNewUser(null);
    navigate("/login");
  };

  return (
    <Navbar>
      <Navbar.Brand href="/">Loan Application</Navbar.Brand>
      <Nav>
        <Nav.Item href="/">View Loans</Nav.Item>
        <Nav.Item href="/CreateLoan">Apply Loan</Nav.Item>
      </Nav>
      <Nav pullRight>
        <Nav.Menu
          placement="leftStart"
          className="top-3 right-3"
          renderToggle={renderToggle}
        >
          <Nav.Item>{newUser?.name}</Nav.Item>

          <Nav.Item onClickCapture={handleLogout}>
            <ExitIcon /> LogOut
          </Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
};

export default Header;
