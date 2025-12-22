const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();
const db = require("./config/db");

const app = express();
app.use(cors());
app.use(express.json());

const authRoutes = require("./routes/auth");
app.use("/api/auth", authRoutes);

const taskRoutes = require("./routes/tasks");
app.use("/api/tasks", taskRoutes);

const notesRoutes = require("./routes/notes");
app.use("/api/notes", notesRoutes);


app.get("/", (req, res) => {
  res.send("Server is running...");
});

app.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
