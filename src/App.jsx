import { useState } from "react";
import "./App.css";

import Header from "./components/Header";
import Footer from "./components/Footer";
import AdminLayout from "./components/AdminLayout";
import LearnerLayout from "./components/LearnerLayout";
import LoginForm from "./components/LoginForm";

function App() {
  // Keep the authenticated user's session in the parent component.
  // This allows other components to access user data through props.
  const [session, setSession] = useState(null);

  // This function is passed to LoginForm as the onLogin prop.
  // LoginForm calls it only after successful authentication.
  // Updating session triggers App to re-render.
  const handleLogin = (newSession) => {
    setSession(newSession);
  };

  const handleLogout = () => {
    setSession(null); 
  };

  // Render the appropriate view based on the authenticated user's role.
  // No session → LoginForm.
  // Valid session → Dashboard corresponding to the user's role.
  let content;

  if (!session) {
    content = (
      <main>
        <LoginForm onLogin={handleLogin} />
      </main>
    );
  } else if (session.user.role === "admin") {
    content = <AdminLayout user={session.user} />;
  } else if (session.user.role === "learner") {
    content = <LearnerLayout user={session.user} />;
  } else {
    content = (
      <main>
        <h2>Unsupported role</h2>
      </main>
    );
  }

  return (
    <>
      <Header />
      {session && (
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      )}

      {content}

      <Footer />
    </>
  );
}

export default App;
