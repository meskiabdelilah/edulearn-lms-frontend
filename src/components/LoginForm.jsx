import { useState } from "react";

const LoginForm = ({onLogin}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    setError(null);
    try {
      //Authenticate the user using email and password.
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      // HTTP errors don't automatically trigger catch.
      // Stop the login flow if the backend rejects the credentials.
      if (!response.ok) {
        setError(data.message || "Login failed");
        return;
      }

      //Extract the JWT returned by the backend.
      const token = data.token

      if (!token) {
        setError("NO token received from  the server.");
        return;
      }

      // Use the JWT to request the authenticated user's profile.
      // The login response contains a token, but not the user's role.
      const profileResponse = await fetch("/api/auth/me", {
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
        },
      })

      
      if (!profileResponse.ok) {
        setError("Unable to verify your session.")
        return;
      }

      const profile = await profileResponse.json();

      //Reject invalid or inactive user profiles.
      if (!profile.role || profile.status === false) {
        setError("Your account cannot access the Platform");
        return
      }

      //Notify App.jsx through the callback received as a prop.
      // App.jsx will store the session and render the correct dashboard.
      onLogin({
        token: token,
        user: profile,
      })
    } catch (error) {
      console.error("Error during login:", error);
      setError("Unable to connect to the server. Please try again.");
    } finally {
      // Always stop loading, whether authentication succeeds or fails.
      // Clear the password from React state after the request.
      setIsLoading(false);
      setPassword("");
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
