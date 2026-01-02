import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome, {user?.name}</h2>
      <p>This is your dashboard.</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
}
