import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "./Toast";
import "./auth.css";
import API_URL from "./config";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: "", color: "" });
  const navigate = useNavigate();

  const showToastMessage = (message, type) => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (password) {
      calculatePasswordStrength(password);
    } else {
      setPasswordStrength({ score: 0, text: "", color: "" });
    }
  }, [password]);

  const calculatePasswordStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;

    const strengths = [
      { score: 0, text: "", color: "" },
      { score: 1, text: "Weak", color: "#dc3545" },
      { score: 2, text: "Fair", color: "#ffc107" },
      { score: 3, text: "Good", color: "#17a2b8" },
      { score: 4, text: "Strong", color: "#28a745" },
      { score: 5, text: "Very Strong", color: "#00d4ff" }
    ];

    setPasswordStrength(strengths[score]);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      newErrors.username = "Username can only contain letters, numbers, and underscores";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    
    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      showToastMessage("Please fix the errors in the form", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok) {
        showToastMessage("Account created successfully! Redirecting to login...", "success");
        setTimeout(() => navigate("/"), 2000);
      } else {
        showToastMessage(data.message || "Signup failed", "error");
      }
    } catch (error) {
      showToastMessage("Connection error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSignup();
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
            <div className="brand-logo-waves">
              <div className="brand-wave"></div>
              <div className="brand-wave"></div>
              <div className="brand-wave"></div>
              <div className="brand-wave"></div>
              <div className="brand-wave"></div>
            </div>
            <h1 className="brand-title">Neurotone</h1>
            <p className="brand-subtitle">AI-Powered Emotion Detection for Therapists</p>
            <div className="feature-list">
              <div className="feature-item">
                <span className="feature-icon">⚡</span>
                <span>Real-time Analysis</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <span>High Accuracy</span>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📈</span>
                <span>Track Progress</span>
              </div>
            </div>
          </div>
        </div>

        <div className="auth-right">
          <div className="auth-form-container">
            <div className="auth-header">
              <h2>Create Account</h2>
              <p>Start your emotion analysis journey today</p>
            </div>

            <div className="auth-form">
              <div className="input-group">
                <div className="input-icon">👤</div>
                <input
                  type="text"
                  placeholder="Choose a username (min 3 characters)"
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
                  placeholder="Create a password (min 6 characters)"
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
                {password && passwordStrength.text && (
                  <div className="password-strength">
                    <div className="strength-bar">
                      <div 
                        className="strength-fill" 
                        style={{ 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                    </div>
                    <span className="strength-text" style={{ color: passwordStrength.color }}>
                      {passwordStrength.text}
                    </span>
                  </div>
                )}
              </div>

              <div className="input-group">
                <div className="input-icon confirm-icon">🔑</div>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (errors.confirmPassword) setErrors({...errors, confirmPassword: null});
                  }}
                  onKeyPress={handleKeyPress}
                  className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? "👀" : "🙈"}
                </button>
                {errors.confirmPassword && (
                  <span className="error-message">{errors.confirmPassword}</span>
                )}
                {confirmPassword && password === confirmPassword && (
                  <span className="success-message">✓ Passwords match</span>
                )}
              </div>

              <button 
                onClick={handleSignup} 
                disabled={loading}
                className="auth-button"
              >
                {loading ? (
                  <>
                    <span className="loader"></span>
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <span className="button-arrow">→</span>
                  </>
                )}
              </button>

              <div className="auth-divider">
                <span>Already have an account?</span>
              </div>

              <button 
                onClick={() => navigate("/login")}
                className="auth-button-secondary"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
