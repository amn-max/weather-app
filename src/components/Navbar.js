import React from "react";
import { Button } from "react-bootstrap";
import { useStateValue } from "../StateProvider";
import { useHistory } from "react-router";
import "./NavbarStyles.css";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [{ user }, dispatch] = useStateValue();
  const history = useHistory();
  const handleLogout = async (e) => {
    dispatch({
      type: "SET_USER",
      user: null,
    });
    await localStorage.clear();
    history.replace("/");
  };
  return (
    <div className="navbar container">
      <Button variant="danger" onClick={handleLogout}>
        Log Out
      </Button>
    </div>
  );
};

export default Navbar;
