import React from "react";
import "./GetTask.css";

const GetTask = ({
  tasks,
  toggleTaskCompletion,
  deleteTask,
  emptyImage,
  updateTask,
}) => {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <p>No tasks found. Get Started!?</p>
        <img
          style={{ height: 250, width: 250 }}
          src={emptyImage}
          alt="No tasks"
          className="empty-state-image"
        />
      </div>
    );
  }

  return (
    <div className="tasks-list">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`task-item ${task.completed ? "completed" : ""}`}
        >
          <div className="task-checkbox">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
          </div>
          <div className="task-content">
            <h3>{task.title}</h3>
            <p className="task-description">{task.description}</p>
            <p className="task-priority">Priority: {task.priority}</p>
            <p
              className={`task-status ${task.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              Status: {task.status}
            </p>
            <p className="task-category">Category: {task.category}</p>
            <p className="task-due-date">Due Date: {task.dueDate}</p>
          </div>
          <button className="update-button" onClick={() => updateTask(task.id)}>
            Update
          </button>
          <button className="delete-button" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
};

export default GetTask;
