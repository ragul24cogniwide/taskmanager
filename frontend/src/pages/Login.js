import React, { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";

import background from "../assests/background.jpg";
const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // Optional: Preload the background image for better UX
  useEffect(() => {
    const img = new Image();
    img.src = { background };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8090/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      const data = await response.json(); //since the format coming is json
      localStorage.setItem("user_token", data.token);
      localStorage.setItem("user_id", data.id);

      // console.log("Login submitted:", formData);
      navigate("/home");
    } catch (error) {
      console.error("Error during login:", error.message);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">FocusTrack</h1>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">UserName</label>
            <input
              type="username"
              id="usrname"
              name="username"
              value={formData.username}
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
