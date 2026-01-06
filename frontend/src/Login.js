import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "./auth.css";
import API_URL from "./config";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setToast({ message, type });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      showToastMessage("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("username", username);
        localStorage.setItem("userId", data.userId);
        showToastMessage("Login successful! Redirecting...", "success");
        setTimeout(() => navigate("/home"), 1500);
      } else {
        showToastMessage(data.message || "Invalid credentials", "error");
      }
    } catch (error) {
      showToastMessage("Connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  return (
    <div className="auth-wrapper">
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      
      <div className="auth-container">
        <div className="auth-left">
          <div className="auth-branding">
            <div className="brand-icon">🎭</div>
            <h1 className="brand-title">Emotion AI</h1>
            <p className="brand-subtitle">Understand emotions through voice analysis</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">🎤</span>
                <span>Voice Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <span>Detailed Reports</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🧠</span>
                <span>AI-Powered Insights</span>
              </div>
              
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Welcome Back</h2>
              <p>Sign in to continue your journey</p>
            </div>

            <div className="auth-form">
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({...errors, username: null});
                  }}
                  onKeyPress={handleKeyPress}
                  className={`auth-input ${errors.username ? 'input-error' : ''}`}
                />
                {errors.username && (
                  <span className="error-message">{errors.username}</span>
                )}
              </div>

              <div className="input-group">
                <div className="input-icon">🔒</div>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors({...errors, password: null});
                  }}
                  onKeyPress={handleKeyPress}
                  className={`auth-input ${errors.password ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? "👀" : "🙈"}
                </button>
                {errors.password && (
                  <span className="error-message">{errors.password}</span>
                )}
              </div>

              <button 
                onClick={handleLogin} 
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  <>
                    <span className="loader"></span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

              <div className="auth-divider">
                <span>New to Emotion AI?</span>
              </div>

              <button 
                onClick={() => navigate("/signup")}
                className="auth-button-secondary"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
