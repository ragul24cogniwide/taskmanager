import React, { useState, useEffect } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("user_token");
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user_id = localStorage.getItem("user_id");
        const response = await fetch(
          `${API_KEY}/api/tasks/getalltasksbyid/${user_id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
        if (!response.ok) throw new Error("Failed to fetch tasks");
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        console.error("Error fetching tasks:", err);
      }
    };

    fetchTasks();
  }, []);

  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const upcomingTasks = tasks.filter((task) => {
    const taskDueDate = task.dueDate;
    return (
      taskDueDate === formatDate(today) || taskDueDate === formatDate(tomorrow)
    );
  });

  const finishedTasks = tasks.filter((task) => {
    const taskDate = new Date(task.dueDate);
    return taskDate < new Date(formatDate(today)); // before today
  });

  return (
    <div className="main">
      <h1 className="text">Notifications</h1>
      <p className="dashboard-caption">
        Stay updated with your tasks! Here are your upcoming tasks and due
        reminders.
        <br />
        You can also view your finished tasks in the Tasks section.
      </p>

      <h2>Upcoming Tasks</h2>
      <div className="task-list">
        {upcomingTasks.length > 0 ? (
          upcomingTasks.map((task) => (
            <div className="task-card" key={task._id}>
              <h3>⚠️ {task.title}</h3>
              <p>Due Date: {task.dueDate}</p>
              <p>{task.description}</p>
            </div>
          ))
        ) : (
          <p>No upcoming tasks.</p>
        )}
      </div>

      <h2>Overdue Tasks</h2>
      <div className="task-list">
        {finishedTasks.length > 0 ? (
          finishedTasks.map((task) => (
            <div className="task-card finished" key={task._id}>
              <h3>❌ {task.title}</h3>
              <p>Due Date: {task.dueDate}</p>
              <p>{task.description}</p>
            </div>
          ))
        ) : (
          <p>No OverDue tasks.</p>
        )}
      </div>
    </div>
  );
};

export default Notifications;
