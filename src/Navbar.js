import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => (
  <nav>
    <Link to="/home">Home</Link>
    <Link to="/reports">Reports</Link>
    <Link to="/">Logout</Link>
  </nav>
);

export default Navbar;
