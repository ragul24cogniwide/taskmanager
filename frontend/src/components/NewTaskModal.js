import React, { useState } from "react";
import "./NewTaskModal.css";

const NewTaskModal = ({ onClose, onCreate }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    status: "Pending",
    duedate: "",
  });

  // const userId = localStorage.getItem("user_id");
  // const token = localStorage.getItem("user_token");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (taskData.title.trim()) {
      console.log("Submitting task data:", taskData);
      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(
          `http://localhost:8090/api/tasks/createtasks`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
            credentials: "include", // This helps with CORS for cookies
          }
        );

        console.log("Response status:", response.status);

        if (response.ok) {
          const result = await response.text();
          console.log("Task created successfully:", result);
          onCreate(result);
          onClose();
        } else {
          const errorText = await response.text();
          console.error("Failed to create task:", response.status, errorText);
          // Optionally show an error to the user
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    } else {
      console.error("Task title cannot be empty");
      // Optionally show validation error to the user
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Task</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            placeholder="Task title"
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            placeholder="Task description"
            onChange={handleChange}
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Category</label>
            <select name="category" onChange={handleChange}>
              <option>Personal</option>
              <option>Work</option>
              <option>Finance</option>
              <option>Health</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select name="priority" onChange={handleChange}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Status</label>
            <select name="status" onChange={handleChange}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input type="date" name="dueDate" onChange={handleChange} />
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleSubmit}>Create Task</button>
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
