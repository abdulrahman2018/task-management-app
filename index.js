const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const app = express();
const port = 5100;

// Middleware
app.use(express.json());
app.use(cors());

// Initialize SQLite Database
const db = new sqlite3.Database("./tasks.db", (err) => {
  if (err) {
    console.error("Error opening database:", err.message);
  } else {
    console.log("Connected to the SQLite database.");
  }
});

// Create the tasks table if it doesn't exist
db.run(
  "CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, status TEXT, due_date TEXT)",
  (err) => {
    if (err) {
      console.error("Error creating table:", err.message);
    }
  }
);

// Routes

// Get all tasks
app.get("/tasks", (req, res) => {
  db.all("SELECT * FROM tasks", [], (err, rows) => {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Add a new task
app.post("/tasks", (req, res) => {
  const { name, status = "pending", due_date = null } = req.body;
  const sql = "INSERT INTO tasks (name, status, due_date) VALUES (?, ?, ?)";
  db.run(sql, [name, status, due_date], function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(201).json({ id: this.lastID, name, status, due_date });
    }
  });
});

// Update a task
app.put("/tasks/:id", (req, res) => {
  const { name, due_date } = req.body; // Add due_date to request body
  const { id } = req.params;
  const sql = "UPDATE tasks SET name = ?, due_date = ? WHERE id = ?";
  db.run(sql, [name, due_date, id], function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.json({ id, name, due_date });
    }
  });
});

// Delete a task
app.delete("/tasks/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM tasks WHERE id = ?";
  db.run(sql, [id], function (err) {
    if (err) {
      res.status(500).json({ message: err.message });
    } else {
      res.status(204).send();
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
