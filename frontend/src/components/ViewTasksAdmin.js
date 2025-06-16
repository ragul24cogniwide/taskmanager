import React, { useEffect, useState } from "react";
import "./ViewTasksAdmin.css";

const ViewTasksAdmin = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);
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
        if (!response.ok) throw new Error("Failed to fetch tasks");

        const matchedTasks = data.filter(
          (task) =>
            task.status == "Pending" ||
            (task.status == "In Progress" && task.userid == user_id)
        );
        // const filteredTasks = data.filter()
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

  const updateStatus = async (taskId, newStatus) => {
    const taskToUpdate = tasks.find((task) => task.id === taskId);

    if (!taskToUpdate) return;

    const updatedTask = {
      title: taskToUpdate.title || "",
      description: taskToUpdate.description || "",
      category: taskToUpdate.category || "",
      dueDate: taskToUpdate.dueDate || "",
      priority: taskToUpdate.priority || "",
      status: newStatus,
    };

    try {
      const response = await fetch(
        `${API_KEY}/api/tasks/updatetask/${taskId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatedTask),
          credentials: "include",
        }
      );

      if (response.ok) {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task
          )
        );
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  if (loading) return <div className="center">Loading tasks...</div>;
  if (error) return <div>{error}</div>;
  if (tasks.length === 0)
    return <div className="center">No tasks assigned by admin.</div>;

  return (
    <div className="main-content">
      <h2 className="admin-heading">Tasks by Admin</h2>
      <div className="tasks-table">
        <div className="tasks-header">
          <div>Task ID</div>
          <div>Title</div>
          <div>Description</div>
          <div>Category</div>
          <div>Status</div>
          <div>Due Date</div>
        </div>
        {filteredTasks.map((task) => (
          <div key={task.id} className="tasks-row">
            <div>{task.id}</div>
            <div>{task.title}</div>
            <div>{task.description}</div>
            <div>{task.category}</div>
            <div>
              <select
                value={task.status}
                onChange={(e) => updateStatus(task.id, e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div>{task.dueDate}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ViewTasksAdmin;
