import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../AuthContext";
import "./Login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add actual authentication logic here
    // For now, we'll simulate a successful login
    login({
      email,
      // Add other user data you want to store
    });
    navigate("/");
  };

  return (
    <div className="login-container">
      <div className="login-header">
        <h1>Welcome to V1</h1>
        <h2>SIGN IN</h2>
      </div>

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address *</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signin-button">
          SIGN IN
        </button>
      </form>

      <div className="create-account">
        <p>Create an Account</p>
      </div>
    </div>
  );
};

export default Login;
