import "./ViewTasks.css";

const ViewTasks = ({ task, onClose }) => {
  if (!task) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="close-button" onClick={onClose}>
          &times;
        </span>
        <h2 className="task-title">{task.title}</h2>
        <div className="task-details">
          <div className="task-item">
            <span className="label">Description:</span>
            <span className="value">{task.description}</span>
          </div>
          <div className="task-item">
            <span className="label">Priority:</span>
            <span className={`value badge ${task.priority.toLowerCase()}`}>
              {task.priority}
            </span>
          </div>
          <div className="task-item">
            <span className="label">Status:</span>
            <span className="value">{task.status}</span>
          </div>
          <div className="task-item">
            <span className="label">Category:</span>
            <span className="value">{task.category}</span>
          </div>
          <div className="task-item">
            <span className="label">Due Date:</span>
            <span className="value">{task.dueDate}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTasks;
