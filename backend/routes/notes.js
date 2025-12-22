const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* GET notes by user */
router.get("/:user_id", (req, res) => {
    const { user_id } = req.params;

    db.query(
        "SELECT * FROM notes WHERE user_id = ? ORDER BY pinned DESC, created_at DESC",
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json(results);
        }
    );
});

/* ADD note */
router.post("/", (req, res) => {
    const { user_id, title, content, color } = req.body;

    db.query(
        "INSERT INTO notes (user_id, title, content, color) VALUES (?, ?, ?, ?)",
        [user_id, title, content, color],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Note added successfully" });
        }
    );
});

/* PIN / UNPIN note */
router.put("/pin/:id", (req, res) => {
    db.query(
        "UPDATE notes SET pinned = !pinned WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Pin status updated" });
        }
    );
});

/* DELETE note */
router.delete("/:id", (req, res) => {
    db.query(
        "DELETE FROM notes WHERE id = ?",
        [req.params.id],
        (err) => {
            if (err) return res.status(500).json({ message: "Database error" });
            res.json({ message: "Note deleted" });
        }
    );
});

module.exports = router;
