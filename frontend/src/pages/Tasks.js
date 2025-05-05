import React, { useState, useEffect } from "react";
import notasks from "../assests/no-tasks-removebg-preview.png";
import NewTaskModal from "../components/NewTaskModal";
import GetTask from "../components/GetTask";
import { Plus } from "lucide-react";
import "./Tasks.css";

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

      {/* 👉 All tasks shown from GetTask */}
      <GetTask
        tasks={filteredTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        emptyImage={notasks}
      />

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
