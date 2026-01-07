import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import Navbar from "./Navbar";
import Landing from "./Landing";
import Signup from "./Signup";
import Login from "./Login";
import Home from "./Home";
import Reports from "./Reports";
import NotFound from "./NotFound";
import "./styles.css";

const App = () => {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup users={users} setUsers={setUsers} />} />
          <Route path="/home" element={<><Navbar /><Home addReport={(report) => setReports([...reports, report])} /></>} />
          <Route path="/reports" element={<><Navbar /><Reports reports={reports} /></>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
      <Analytics />
      <SpeedInsights />
    </>
  );
};

export default App;
