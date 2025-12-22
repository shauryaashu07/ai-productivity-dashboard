const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get all tasks for a user
router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;

    db.query(
        "SELECT * FROM tasks WHERE user_id = ? ORDER BY id DESC",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(results);
        }
    );
});

// Add a task
router.post("/", (req, res) => {
    const { user_id, title, description, deadline, priority } = req.body;

    if (!user_id || !title) {
        return res.status(400).json({ message: "Required fields missing" });
    }

    db.query(
        "INSERT INTO tasks (user_id, title, description, deadline, priority) VALUES (?, ?, ?, ?, ?)",
        [user_id, title, description, deadline, priority],
        (err, result) => {
            if (err) return res.status(500).json({ message: "Database error" });

            res.json({ message: "Task added!" });
        }
    );
});

// Delete a task
router.delete("/:id", (req, res) => {
    const task_id = req.params.id;

    db.query("DELETE FROM tasks WHERE id = ?", [task_id], (err) => {
        if (err) return res.status(500).json({ message: "Database error" });
        res.json({ message: "Task deleted!" });
    });
});

// Mark task complete
router.put("/complete/:id", (req, res) => {
    const task_id = req.params.id;

    db.query(
        "UPDATE tasks SET status = 'completed' WHERE id = ?",
        [task_id],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Task completed!" });
        }
    );
});

module.exports = router;
