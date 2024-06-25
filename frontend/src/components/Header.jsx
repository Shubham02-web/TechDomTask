import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Navbar, Nav, Avatar } from "rsuite";
import ExitIcon from "@rsuite/icons/Exit";

import { AuthContext } from "../App";
const renderToggle = (props) => <Avatar size="sm" circle {...props} />;
const Header = () => {
  const { newUser, setNewUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    // Clear local storage and navigate to login page
    localStorage.removeItem("token");
    setNewUser(null);
    navigate("/login");
  };

  return (
    <Navbar appearance="subtle">
      <Navbar.Brand to="/" className="font-bold">
        Loan Application
      </Navbar.Brand>
      <Nav>
        <Nav.Item>
          <NavLink
            to={"/"}
            style={({ isActive, isTransitioning }) => {
              return {
                fontWeight: isActive ? "bold" : "",
                color: !isActive ? "" : "blue",
                viewTransitionName: isTransitioning ? "slide" : "",
              };
            }}
          >
            View Loans
          </NavLink>
        </Nav.Item>
        {newUser?.role !== "admin" && (
          <Nav.Item>
            <NavLink
              to="/CreateLoan"
              style={({ isActive, isTransitioning }) => {
                return {
                  fontWeight: isActive ? "bold" : "",
                  color: !isActive ? "" : "blue",
                  viewTransitionName: isTransitioning ? "slide" : "",
                };
              }}
            >
              Apply Loan
            </NavLink>
          </Nav.Item>
        )}
      </Nav>
      <Nav pullRight>
        <Nav.Menu
          placement="leftStart"
          className="top-3 right-3"
          renderToggle={renderToggle}
        >
          <Nav.Item>{newUser?.name}</Nav.Item>
          <Nav.Item>{newUser?.role}</Nav.Item>
          <Nav.Item onClickCapture={handleLogout}>
            <ExitIcon /> LogOut
          </Nav.Item>
        </Nav.Menu>
      </Nav>
    </Navbar>
  );
};

export default Header;
