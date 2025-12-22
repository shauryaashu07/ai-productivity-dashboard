/****************************
 * AUTH CHECK
 ****************************/
const token = localStorage.getItem("token");
const user = JSON.parse(localStorage.getItem("user"));

if (!token || !user) {
    alert("Please login first");
    window.location.href = "login.html";
}

/****************************
 * SHOW USERNAME
 ****************************/
document.getElementById("username").textContent = user.name;

/****************************
 * LOGOUT
 ****************************/
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.clear();
    window.location.href = "login.html";
});

/****************************
 * PAGE NAVIGATION
 ****************************/
function showPage(pageId, element) {
    document.querySelectorAll(".page").forEach(p => p.style.display = "none");
    document.getElementById(pageId).style.display = "block";

    document.querySelectorAll(".nav-item").forEach(i => i.classList.remove("active"));
    element.classList.add("active");

    if (pageId === "tasksPage") loadTasks();
    if (pageId === "notesPage") loadNotes();
}

/****************************
 * TASKS
 ****************************/
async function loadTasks() {
    const response = await fetch(`http://localhost:5000/api/tasks/${user.id}`);
    const tasks = await response.json();

    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.innerHTML = "<p style='color:#aaa'>No tasks yet</p>";
        return;
    }

    tasks.forEach(task => {
        taskList.innerHTML += `
            <li class="task-card">
                <strong>${task.title}</strong>
                <p>${task.description || ""}</p>
                <small>Deadline: ${task.deadline || "None"}</small><br>
                <small>Priority: ${task.priority}</small><br>
                <small>Status: ${task.status}</small><br>

                <button onclick="completeTask(${task.id})">Complete</button>
                <button onclick="deleteTask(${task.id})">Delete</button>
            </li>
        `;
    });
}

async function addTask() {
    const title = document.getElementById("taskTitle").value;
    const description = document.getElementById("taskDesc").value;
    const deadline = document.getElementById("taskDeadline").value;
    const priority = document.getElementById("taskPriority").value;

    if (!title) {
        alert("Task title is required");
        return;
    }

    await fetch("http://localhost:5000/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: user.id, title, description, deadline, priority })
    });

    document.getElementById("taskTitle").value = "";
    document.getElementById("taskDesc").value = "";
    document.getElementById("taskDeadline").value = "";

    loadTasks();
}

async function deleteTask(id) {
    await fetch(`http://localhost:5000/api/tasks/${id}`, { method: "DELETE" });
    loadTasks();
}

async function completeTask(id) {
    await fetch(`http://localhost:5000/api/tasks/complete/${id}`, { method: "PUT" });
    loadTasks();
}

/****************************
 * NOTES
 ****************************/
async function loadNotes() {
    const res = await fetch(`http://localhost:5000/api/notes/${user.id}`);
    const notes = await res.json();

    // ✅ UPDATE NOTES COUNT (THIS IS THE LINE YOU ASKED ABOUT)
    document.getElementById("noteCount").textContent = notes.length;

    const grid = document.getElementById("notesGrid");
    grid.innerHTML = "";

    notes.forEach(note => {
        grid.innerHTML += `
            <div class="note-card" 
                 style="background:${note.color}; 
                        border:${note.pinned ? '2px solid gold' : 'none'}">

                <h4>${note.pinned ? '📌 ' : ''}${note.title || "Untitled"}</h4>
                <p>${note.content}</p>

                <div class="note-actions">
                    <button onclick="togglePin(${note.id})">
                        ${note.pinned ? "Unpin" : "Pin"}
                    </button>
                    <button onclick="deleteNote(${note.id})">Delete</button>
                </div>
            </div>
        `;
    });
}


async function addNote() {
    const title = document.getElementById("noteTitle").value.trim();
    const content = document.getElementById("noteContent").value.trim();
    const color = document.getElementById("noteColor").value;

    // ✅ Validation
    if (!title && !content) {
        alert("Note cannot be empty!");
        return;
    }

    try {
        const response = await fetch("http://localhost:5000/api/notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: user.id,
                title,
                content,
                color
            })
        });

        if (!response.ok) {
            throw new Error("Failed to add note");
        }

        // ✅ Clear inputs after success
        document.getElementById("noteTitle").value = "";
        document.getElementById("noteContent").value = "";

        // ✅ Reload notes + update count
        loadNotes();

    } catch (error) {
        console.error(error);
        alert("Something went wrong while adding note");
    }
}

async function togglePin(id) {
    await fetch(`http://localhost:5000/api/notes/pin/${id}`, { method: "PUT" });
    loadNotes();
}

async function deleteNote(id) {
    await fetch(`http://localhost:5000/api/notes/${id}`, { method: "DELETE" });
    loadNotes();
}

/****************************
 * INITIAL LOAD
 ****************************/
loadTasks();
