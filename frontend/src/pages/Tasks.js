import React, { useState, useEffect } from "react";
import notasks from "../assests/no-tasks-removebg-preview.png";
import NewTaskModal from "../components/NewTaskModal";
import "./Tasks.css"; // Assuming you have a CSS file for styling

import { Plus } from "lucide-react";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const handleCreateTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  // Filter tasks by search term
  const filteredTasks = tasks.filter(
    (task) =>
      task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="tasks-container">
      <div className="tasks-header">
        <div className="tasks-header-text">
          <h1>Task Manager</h1>
          <p>Organize and manage your tasks efficiently</p>
        </div>
      </div>

      {/* 🔍 Search Bar + Add Task Button */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <button onClick={() => setShowModal(true)} className="add-button">
          <Plus size={18} />
          Add New Task
        </button>
      </div>

      <div className="tasks-list">
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks found. Get Started!?</p>
            <img
              style={{ height: 250, width: 250 }}
              src={notasks}
              alt="No tasks"
              className="empty-state-image"
            />
          </div>
        ) : (
          filteredTasks.map((task) => (
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
                <p className="task-date">
                  {new Date(task.createdAt).toLocaleDateString()}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>

      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </div>
  );
};

export default Tasks;
