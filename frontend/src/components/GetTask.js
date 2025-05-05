import React, { useEffect, useState } from "react";
import "./GetTask.css";
import notfound from "../assests/not-found-removebg-preview.png";

const GetTask = ({ toggleTaskCompletion, deleteTask, emptyImage }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const user_id = localStorage.getItem("user_id");
  const token = localStorage.getItem("user_token");

  // const API_KEY = process.env.REACT_APP_API_KEY;
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `http://localhost:8090/api/tasks/getalltasksbyid/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include", // This helps with CORS for cookies
          }
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        // console.log("Fetched tasks:", data); // Log the fetched tasks
        setTasks(data); // ✅ tasks.map() will work
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) return <div className="loading">Loading tasks...</div>;
  if (error)
    return (
      <div className="error">
        Something Went Wrong Failed to Fetch Taks!!!
        <div>
          <img
            style={{ height: 250, width: 250 }}
            src={notfound}
            alt="Error"
            className="error-image"
          />
        </div>
      </div>
    );

  if (!tasks.length) {
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
            <p className="task-status">Status: {task.status}</p>
            <p className="task-category">Category: {task.category}</p>
            <p className="task-due-date">Due Date: {task.dueDate}</p>
            {/* <p className="task-assigned-to">Assigned to: {task.assignedTo}</p>
            <p className="task-date">
              {new Date(task.createdAt).toLocaleDateString()}
            </p> */}
          </div>
          <button className="delete-button" onClick={() => deleteTask(task.id)}>
            Edit
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
