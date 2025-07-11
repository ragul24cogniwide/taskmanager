import { useState, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../components/UserContext"; // Import UserContext

import background from "../../assests/background.jpg";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false); //loader state
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = background; //
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const API_KEY = process.env.REACT_APP_API_KEY;
  const { setUserInfo } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setIsError(false);

    try {
      const response = await fetch(`${API_KEY}/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Handle 401
        if (response.status === 401) {
          setError("Invalid username or password or Login approval pending");
        } else {
          throw new Error("Something went wrong. Please try again.");
        }
      }

      const data = await response.json();
      localStorage.setItem("user_token", data.token);

      setTimeout(() => {
        navigate("/dashboard");
        setUserInfo({ role: data.role, id: data.id });
        navigate("/dashboard");
      }, 1000);
    } catch (error) {
      console.error("Login error:", error.message);
      setError(
        "Login failed. Please check your credentials,  or Login approval pending"
      );
      setIsError(true);
      setLoading(false);
    }
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">FocusTrack</h1>
        <h2 className="login">Login</h2>

        {isError && <div className="error-message">{error}</div>}

        {loading ? (
          <div className="loader"></div> // loader component
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">UserName</label>
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
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
