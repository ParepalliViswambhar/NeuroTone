import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [username, setUsername] = useState("");
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/");
    } else {
      setUsername(storedUsername);
      fetchReports(storedUsername);
    }
  }, [navigate]);

  const fetchReports = async (user) => {
    try {
      const response = await fetch(`http://localhost:8000/reports?username=${user}`);
      const data = await response.json();

      if (response.ok) {
        setReports(data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {username}</h2>
      <h2>Reports</h2>
      {reports.length > 0 ? (
        reports.map((report, index) => (
          <div key={index} className="report">
            <p>Name: {report.name}</p>
            <p>Age: {report.age}</p>
            <p>Predicted Emotion: {report.predicted_emotion}</p>
            
          </div>
        ))
      ) : (
        <p>No reports available</p>
      )}
    </div>
  );
};

export default Reports;
