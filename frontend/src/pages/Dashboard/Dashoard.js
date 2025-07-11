import React, { useEffect, useState } from "react";
import PieChart from "./PieChart";
import TaskCard from "./TaskCard";
import "./Dashboard.css";
import { useUser } from "../../components/UserContext"; // Import UserContext

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const token = localStorage.getItem("user_token");
  const API_KEY = process.env.REACT_APP_API_KEY;
  const { userInfo } = useUser();
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(
          `${API_KEY}/api/tasks/getalltasksbyid/${userInfo.id}`,
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

  const recentTasks = tasks.slice(-5).reverse();
  const today = new Date();
  const tomorrow = new Date();
  tomorrow.setDate(today.getDate() + 1);

  const formatDate = (date) => date.toISOString().split("T")[0];

  const dueReminders = tasks
    .filter((task) => {
      const taskDueDate = task.dueDate;
      return (
        taskDueDate === formatDate(today) ||
        taskDueDate === formatDate(tomorrow)
      );
    })
    .slice(-5)
    .reverse(); //  to show the most recent ones first

  return (
    <div className="dashboard-container">
      <h2 className="text">Focus-Track Dashboard</h2>
      <p className="dashboard-caption">
        Stay organized and on top of your tasks with a quick overview of
        priorities, due reminders, and recent activity.
      </p>

      <div className="dashboard-top">
        <div className="pie-container">
          <h3>Task Priorities</h3>
          <PieChart tasks={tasks} />
        </div>
        <div className="reminders">
          <h3>Due Today or Tomorrow</h3>
          {dueReminders.length === 0 ? (
            <p>No upcoming tasks due today or tomorrow!</p>
          ) : (
            dueReminders.map((task) => (
              <div className="reminder" key={task._id}>
                ⚠️ {task.title} is due on {task.dueDate}!
              </div>
            ))
          )}
        </div>
      </div>

      <div className="recent-tasks">
        <h3>Recent Tasks</h3>
        {recentTasks.map((task) => (
          <TaskCard key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
