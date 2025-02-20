import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username || !password) {
      alert("Both fields are required!");
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", username); // Store username
        alert("Login successful!");
        navigate("/home");
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert("Error logging in. Try again later.");
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <input type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
      <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p className="account-text">Don't have an account? <span onClick={() => navigate("/signup")}>Signup</span></p>
    </div>
  );
};

export default Login;
