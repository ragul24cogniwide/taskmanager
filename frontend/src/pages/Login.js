import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Optional: Preload the background image for better UX
  useEffect(() => {
    const img = new Image();
    img.src =
      "https://png.pngtree.com/thumb_back/fh260/background/20220427/pngtree-tiny-business-people-and-manager-at-tasks-and-goals-accomplishment-chart-image_1091427.jpg";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your login logic here
    console.log("Login submitted:", formData);
  };

  const handleRegisterClick = () => {
    // Add navigation to register page
    console.log("Navigate to register");
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">FocusTrack</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
        <p className="register-text">
          Don't have an account?{" "}
          <span className="register-link" onClick={handleRegisterClick}>
            Register
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
