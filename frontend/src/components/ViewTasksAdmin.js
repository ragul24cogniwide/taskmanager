import React, { useEffect, useState } from "react";
import "./ViewTasksAdmin.css";

const ViewTasksAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;
  const token = localStorage.getItem("user_token");
  const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user_id || !token) {
        setError("Missing user credentials.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_KEY}/api/tasks/getalltasks`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        const data = await response.json();
        console.log("Fetched tasks:", data); // Debugging line

        if (!response.ok) {
          // Only show tasks where task.userid matches the localStorage user_id
          throw new Error("Failed to fetch tasks");
        }
        const matchedTasks = data.filter((task) => task.userid == user_id);
        setTasks(matchedTasks);
        setFilteredTasks(matchedTasks);
      } catch (err) {
        setError("Something went wrong.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [API_KEY, token, user_id]);

  if (loading) return <div>Loading tasks...</div>;
  if (error) return <div>{error}</div>;
  if (filteredTasks.length === 0) {
    return <div>No tasks assigned by admin.</div>;
  }

  return (
    <div className="tasks-table">
      <div className="tasks-header">
        <div>Title</div>
        <div>Description</div>
        <div>Status</div>
        <div>Due Date</div>
        <div>Completed</div>
      </div>
      {filteredTasks.map((task) => (
        <div key={task.id} className="tasks-row">
          <div>{task.title}</div>
          <div>{task.description}</div>
          <div>{task.status}</div>
          <div>{task.dueDate}</div>
          <div>
            <input type="checkbox" checked={task.completed} readOnly />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewTasksAdmin;
