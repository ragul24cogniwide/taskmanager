import React, { useState } from "react";
import "./NewTaskModal.css";

const NewTaskModal = ({ onClose, onCreate }) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    status: "Pending",
    Date: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (taskData.title.trim()) {
      onCreate(taskData);
      onClose();
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create New Task</h2>
        <input name="title" placeholder="Task title" onChange={handleChange} />
        <textarea
          name="description"
          placeholder="Task description"
          onChange={handleChange}
        />
        <div className="row">
          <select name="category" onChange={handleChange}>
            <option>Personal</option>
            <option>Work</option>
            <option>Finance</option>
            <option>Health</option>
          </select>
          <select name="priority" onChange={handleChange}>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>
        <div className="row">
          <select name="status" onChange={handleChange}>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          <input type="date" name="dueDate" onChange={handleChange} />
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
