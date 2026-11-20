const LearnerLayout = ({ user }) => {
  return (
    <main>
      <h2>Learner Dashboard</h2>
      <p>Welcome, {user.fullName}</p>
      <p>Role: {user.role}</p>
    </main>
  );
};

export default LearnerLayout;