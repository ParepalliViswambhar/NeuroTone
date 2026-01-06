import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./Navbar";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Reports from "./Reports";
import "./styles.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} /> {/* Removed users prop */}
        <Route path="/signup" element={<Signup users={users} setUsers={setUsers} />} />
        <Route path="/home" element={<><Navbar /><Home addReport={(report) => setReports([...reports, report])} /></>} />
        <Route path="/reports" element={<><Navbar /><Reports reports={reports} /></>} />
      </Routes>
    </Router>
  );
};

export default App;
