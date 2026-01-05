// ✅ Declare BASE_URL ONLY ONCE
const BASE_URL = "http://localhost:5000/api";

// ---------- AUTH ----------
export async function loginUser(data) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

export async function signupUser(data) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

// ---------- TASKS ----------
export async function getTasks(userId) {
  const res = await fetch(`${BASE_URL}/tasks/${userId}`);
  return res.json();
}

export async function addTask(task) {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function deleteTask(taskId) {
  const res = await fetch(`${BASE_URL}/tasks/${taskId}`, {
    method: "DELETE",
  });
  return res.json();
}

export async function completeTask(taskId) {
  const res = await fetch(`${BASE_URL}/tasks/complete/${taskId}`, {
    method: "PUT",
  });
  return res.json();
}
