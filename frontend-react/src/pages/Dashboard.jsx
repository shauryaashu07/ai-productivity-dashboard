import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getTasks,
  addTask,
  deleteTask,
  completeTask,
} from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [tasks, setTasks] = useState([]);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Low");
  const [deadline, setDeadline] = useState("");

  // 🔐 Safety check
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // 📥 Load tasks
  async function loadTasks() {
    const data = await getTasks(user.id);
    setTasks(data);
  }

  useEffect(() => {
    loadTasks();
  }, []);

  // ➕ Add task
  async function handleAddTask(e) {
    e.preventDefault();

    if (!title) {
      alert("Task title required");
      return;
    }

    await addTask({
      user_id: user.id,
      title,
      description,
      priority,
      deadline,
    });

    setTitle("");
    setDescription("");
    setDeadline("");
    setPriority("Low");

    loadTasks();
  }

  // ✔ Complete task
  async function handleComplete(id) {
    await completeTask(id);
    loadTasks();
  }

  // 🗑 Delete task
  async function handleDelete(id) {
    await deleteTask(id);
    loadTasks();
  }

  // 🚪 Logout
  function logout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div style={{ padding: "30px" }}>
      <h2>Welcome, {user?.name}</h2>
      <button onClick={logout}>Logout</button>

      <hr />

      <h3>Add Task</h3>
      <form onSubmit={handleAddTask}>
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          type="date"
          value={deadline}
          onChange={(e) => setDeadline(e.target.value)}
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <button type="submit">Add</button>
      </form>

      <hr />

      <h3>Your Tasks ({tasks.length})</h3>

      {tasks.map((task) => (
        <div
          key={task.id}
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            marginBottom: "10px",
          }}
        >
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <small>Priority: {task.priority}</small>
          <br />
          <small>Status: {task.status}</small>
          <br />

          <button onClick={() => handleComplete(task.id)}>
            Complete
          </button>
          <button onClick={() => handleDelete(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
