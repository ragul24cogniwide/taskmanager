import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

import background from "../../assests/background.jpg"; // Adjust the path as necessary

const Register = () => {
  // const API_KEY = process.env.REACT_APP_API_KEY;
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    emailid: "",
    role: "USER",
    password: "",
    confirmpassword: "",
    status: "Pending",
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

  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_KEY}/api/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }

      // console.log("Registration submitted:", formData);
      navigate("/");
    } catch (error) {
      console.error("Error during registration:", error.message);
    }
  };

  const handleLoginClick = () => {
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h1 className="register-title">FocusTrack</h1>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="emailid"
              name="emailid"
              value={formData.emailid}
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
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmpassword"
              name="confirmpassword"
              value={formData.confirmpassword}
              onChange={handleChange}
              required
              minLength="6"
            />
          </div>
          <button type="submit" className="register-button">
            Register
          </button>
        </form>
        <p className="login-text">
          Already have an account?{" "}
          <span className="login-link" onClick={handleLoginClick}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;
