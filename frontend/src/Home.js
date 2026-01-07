import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "./config";

const Home = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (!storedUsername) {
      navigate("/");
    } else {
      setUsername(storedUsername);
    }
  }, [navigate]);

  const handleSubmit = async () => {
    if (!username || !name || !age || !file) {
      alert("Please fill all fields and upload an audio file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("username", username);
    formData.append("name", name);
    formData.append("age", age);
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/api/predictions/predict`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
      
      // Clear input fields after successful prediction
      setName("");
      setAge("");
      setFile(null);
      
      // Reset file input element
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
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

  return (
    <div className="container">
      <h2><span className="emoji">👋</span> Welcome, {username}</h2>
      <h3>🎤 Emotion Analysis</h3>
      
      <div className="form-group">
        <label>Name</label>
        <input 
          type="text" 
          placeholder="Enter your name" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <label>Age</label>
        <input 
          type="number" 
          placeholder="Enter your age" 
          value={age} 
          onChange={(e) => setAge(e.target.value)} 
        />
      </div>

      <div className="form-group">
        <label>Audio File</label>
        <input 
          ref={fileInputRef}
          type="file" 
          accept="audio/*" 
          onChange={(e) => setFile(e.target.files[0])} 
        />
      </div>

      <button onClick={handleSubmit} disabled={loading}>
        {loading ? (
          <>
            <span className="loader"></span> Analyzing...
          </>
        ) : (
          "🚀 Analyze Emotion"
        )}
      </button>

      {result && (
        <div className="emotion-result">
          <div className="emotion-main">
            <div className="emotion-icon">
              {emotionIcons[result.emotion.toLowerCase()] || "🎭"}
            </div>
            <div className="emotion-label" style={{ color: getEmotionColor(result.emotion) }}>
              {result.emotion}
            </div>
            <p style={{ fontSize: "18px", marginTop: "10px", opacity: 0.9 }}>
              Primary Detected Emotion
            </p>
          </div>

          <h3>📊 Emotion Breakdown</h3>
          <div className="emotion-grid">
            {Object.entries(result.probabilities)
              .sort(([, a], [, b]) => b - a)
              .map(([emotion, prob]) => (
                <div key={emotion} className="emotion-card">
                  <div className="emotion-card-header">
                    <span className="emotion-name">{emotion}</span>
                    <span className="emotion-icon-small">
                      {emotionIcons[emotion.toLowerCase()] || "🎭"}
                    </span>
                  </div>
                  <div className="emotion-percentage">
                    {(prob * 100).toFixed(1)}%
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${prob * 100}%`,
                        background: `linear-gradient(90deg, ${getEmotionColor(emotion)}, #a8edea)`
                      }}
                    ></div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
