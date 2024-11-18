import React, { useState, useEffect } from "react";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    // Fetch tasks when component mounts
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5100/tasks")
      .then((response) => {
        setTasks(response.data); // Update tasks with the latest data
      })
      .catch((err) => {
        console.error("Error fetching tasks:", err);
      });
  };

  const handleUpdateTask = () => {
    if (taskName.trim() && dueDate.trim()) {
      // Send the update request to the backend
      axios
        .put(`http://localhost:5100/tasks/${editingTask}`, {
          name: taskName,
          due_date: dueDate,
        })
        .then((response) => {
          // After updating the task, re-fetch tasks to update UI
          fetchTasks();
          setEditingTask(null);
          setTaskName("");
          setDueDate("");
        })
        .catch((err) => {
          console.error("Error updating task:", err);
        });
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task.id);
    setTaskName(task.name);
    setDueDate(task.due_date); // Pre-fill the due date field
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5100/tasks/${taskId}`)
      .then(() => {
        fetchTasks(); // Re-fetch tasks after deletion
      })
      .catch((err) => {
        console.error("Error deleting task:", err);
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Task List</h1>
      
      {/* Task Cards */}
      <div className="row">
        {tasks.map((task) => (
          <div className="col-md-4 mb-4" key={task.id}>
            <div className="card shadow-lg">
              <div className="card-body">
                <h5 className="card-title">{task.name}</h5>
                <p className="card-text"><strong>Due Date:</strong> {task.due_date || "N/A"}</p>
                <p className="card-text"><strong>Status:</strong> {task.status}</p>
                <button className="btn btn-warning mr-2" onClick={() => handleEditTask(task)}>
                  Edit
                </button>
                <button className="btn btn-danger" onClick={() => handleDeleteTask(task.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Task Form */}
      {editingTask && (
        <div className="card mt-5">
          <div className="card-header">
            <h5>Edit Task</h5>
          </div>
          <div className="card-body">
            <div className="form-group">
              <label>Task Name</label>
              <input
                type="text"
                className="form-control"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Enter task name"
              />
            </div>
            <div className="form-group mt-3">
              <label>Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <button className="btn btn-primary mt-3" onClick={handleUpdateTask}>
              Save Changes
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskList;
