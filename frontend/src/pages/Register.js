import React, { useState, useEffect } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // Optional: Preload the background image for better UX
  useEffect(() => {
    const img = new Image();
    img.src =
      "https://wallpapers.com/images/hd/project-management-tools-illustration-20vwwkbworhkpzff.jpg";
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
    // // Add validation here
    // if (formData.password !== formData.confirmPassword) {
    //   alert("Passwords don't match");
    //   return;
    // }
    // Add your registration logic here
    console.log("Registration submitted:", formData);
    navigate("/home");
  };

  const handleLoginClick = () => {
    // Add navigation to login page
    console.log("Navigate to login");
    navigate("/login");
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
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
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
              minLength="6"
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
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
