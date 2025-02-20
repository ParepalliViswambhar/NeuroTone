import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
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
      const response = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Server error");
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Welcome, {username}</h2>
      <h3>Enter Details</h3>
      <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
      <input type="number" placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
      <input type="file" accept="audio/*" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSubmit} disabled={loading}>
        {loading ? "Processing..." : "Submit"}
      </button>

      {result && (
        <div>
          <h3>Predicted Emotion: {result.emotion}</h3>
          <h4>Probabilities:</h4>
          <ul>
            {Object.entries(result.probabilities).map(([emotion, prob]) => (
              <li key={emotion}>
                {emotion}: {prob.toFixed(2)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Home;
