// src/pages/TaskCommunity/TaskCommunity.js
import React, { useEffect, useState } from "react";
import "./TaskCommunity.css";

const TaskCommunity = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    const fetchUsersAndTasks = async () => {
      try {
        const response = await fetch(`${API_KEY}/api/users/getallusers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Failed to fetch data");

        const data = await response.json();
        setUsers(data); // Assuming array of users with tasks
      } catch (err) {
        setError("Unable to load community data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersAndTasks();
  }, []);

  if (loading) return <div className="community-loading">Loading...</div>;
  if (error) return <div className="community-error">{error}</div>;

  return (
    <div className="task-community-page">
      <h2 className="community-title">Task Community</h2>
      <p className="community-description">
        View tasks shared by all users in the community.
      </p>
      <div className="users-container">
        {users.map((user) => (
          <div className="user-card" key={user.id}>
            <h3>{user.username}</h3>
            <ul className="task-list">
              {user.tasks && user.tasks.length > 0 ? (
                user.tasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <strong>{task.title}</strong>: {task.description}
                  </li>
                ))
              ) : (
                <li className="no-task">No tasks found</li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskCommunity;
