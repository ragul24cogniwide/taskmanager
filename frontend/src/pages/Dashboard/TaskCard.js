import React from "react";
import "./TaskCard.css";

const TaskCard = ({ task }) => {
  return (
    <div className="task-card">
      <h4>{task.title}</h4>
      <p>
        Priority:{" "}
        <span className={`priority ${task.priority.toLowerCase()}`}>
          {task.priority}
        </span>
      </p>
      <p>Status:{task.status}</p>
      <p>Due: {task.dueDate}</p>
    </div>
  );
};

export default TaskCard;
