const AdminLayout = ({ user }) => {
  return (
    <main>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.fullName}</p>
      <p>Role: {user.role}</p>
    </main>
  );
};

export default AdminLayout;