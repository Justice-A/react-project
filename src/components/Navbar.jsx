import React from "react";
import { BellOutlined } from "@ant-design/icons";
import "../components/Navbar.css";
import { UserOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useAuthContext } from "../AuthContext";
const Navbar = () => {
  const { currentUser } = useAuthContext();
  return (
    <div>
      <nav className="navbar">
        <div className="nav">
          <div className="logo">
            <Link to="/profile">
              <UserOutlined />
            </Link>
            {console.log("Current User:", currentUser)}
            {currentUser && <span>Hello, {currentUser.name}</span>}
          </div>
          <div className="bell">
            <BellOutlined style={{ fontSize: "1.5em" }} />
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
