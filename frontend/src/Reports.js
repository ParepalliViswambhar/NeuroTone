import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faCakeCandles, 
  faCalendarDays, 
  faChevronDown, 
  faChevronUp,
  faInbox,
  faChartBar
} from "@fortawesome/free-solid-svg-icons";
import { ReportSkeleton } from "./LoadingSkeleton";
import API_URL from "./config";

const Reports = () => {
  const [username, setUsername] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedReport, setExpandedReport] = useState(null);
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
    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/predictions/reports?username=${user}`);
      const data = await response.json();

      if (response.ok) {
        setReports(data.reports || data);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const emotionIcons = {
    happiness: "😊",
    sadness: "😢",
    anger: "😠",
    fear: "😨",
    disgust: "🤢",
    surprise: "😲",
    neutral: "😐",
    calm: "😌"
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      happiness: "#FFD700",
      sadness: "#4169E1",
      anger: "#DC143C",
      fear: "#9370DB",
      disgust: "#32CD32",
      surprise: "#FF69B4",
      neutral: "#A9A9A9",
      calm: "#87CEEB"
    };
    return colors[emotion?.toLowerCase()] || "#00ffc8";
  };

  const toggleExpand = (index) => {
    setExpandedReport(expandedReport === index ? null : index);
  };

  return (
    <div className="container">
      <h2>Welcome, {username}</h2>
      <h3><FontAwesomeIcon icon={faChartBar} /> Your Emotion Reports</h3>
      
      {loading ? (
        <>
          <ReportSkeleton />
          <ReportSkeleton />
          <ReportSkeleton />
        </>
      ) : reports.length > 0 ? (
        reports.map((report, index) => (
          <div key={index} className="report" onClick={() => toggleExpand(index)} style={{ cursor: "pointer" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
                  <FontAwesomeIcon icon={faUser} /> {report.name}
                </p>
                <p style={{ opacity: 0.8, marginBottom: "5px" }}>
                  <FontAwesomeIcon icon={faCakeCandles} /> Age: {report.age}
                </p>
                <p style={{ opacity: 0.7, fontSize: "13px" }}>
                  <FontAwesomeIcon icon={faCalendarDays} /> {new Date(report.createdAt).toLocaleDateString()} {new Date(report.createdAt).toLocaleTimeString()}
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "40px", marginBottom: "5px" }}>
                  {emotionIcons[report.predicted_emotion?.toLowerCase()] || "🎭"}
                </div>
                <p style={{ 
                  fontSize: "18px", 
                  fontWeight: "bold",
                  color: getEmotionColor(report.predicted_emotion)
                }}>
                  {report.predicted_emotion}
                </p>
                <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "5px" }}>
                  {report.confidence ? `${(report.confidence * 100).toFixed(1)}% confidence` : ""}
                </p>
              </div>
            </div>

            {expandedReport === index && report.probabilities && (
              <div style={{ marginTop: "25px", paddingTop: "20px", borderTop: "1px solid rgba(0, 255, 200, 0.2)" }}>
                <h4 style={{ marginBottom: "15px", color: "#00ffc8", fontSize: "16px" }}>
                  <FontAwesomeIcon icon={faChartBar} /> All Emotion Probabilities
                </h4>
                <div className="emotion-grid" style={{ gap: "15px" }}>
                  {Object.entries(report.probabilities)
                    .sort(([, a], [, b]) => b - a)
                    .map(([emotion, prob]) => (
                      <div key={emotion} className="emotion-card" style={{ padding: "15px" }}>
                        <div className="emotion-card-header">
                          <span className="emotion-name" style={{ textTransform: "capitalize" }}>
                            {emotion}
                          </span>
                          <span className="emotion-icon-small">
                            {emotionIcons[emotion.toLowerCase()] || "🎭"}
                          </span>
                        </div>
                        <div className="emotion-percentage" style={{ fontSize: "24px" }}>
                          {(prob * 100).toFixed(1)}%
                        </div>
                        <div className="progress-bar">
                          <div 
                            className="progress-fill" 
                            style={{ 
                              width: `${prob * 100}%`,
                              background: `linear-gradient(90deg, ${getEmotionColor(emotion)}, #00ffc8)`
                            }}
                          ></div>
                        </div>
                      </div>
                    ))}
                </div>
                <p style={{ 
                  textAlign: "center", 
                  marginTop: "15px", 
                  fontSize: "13px", 
                  opacity: 0.6,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px"
                }}>
                  <FontAwesomeIcon icon={faChevronUp} /> Click again to collapse
                </p>
              </div>
            )}
            
            {expandedReport !== index && (
              <p style={{ 
                textAlign: "center", 
                marginTop: "15px", 
                fontSize: "13px", 
                opacity: 0.6,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              }}>
                <FontAwesomeIcon icon={faChevronDown} /> Click to view all emotions
              </p>
            )}
          </div>
        ))
      ) : (
        <div style={{ 
          textAlign: "center", 
          padding: "40px", 
          opacity: 0.7,
          fontSize: "18px" 
        }}>
          <div style={{ fontSize: "48px", marginBottom: "20px" }}>
            <FontAwesomeIcon icon={faInbox} />
          </div>
          <p>No reports available yet</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>
            Start analyzing emotions to see your reports here!
          </p>
        </div>
      )}
    </div>
  );
};

export default Reports;
