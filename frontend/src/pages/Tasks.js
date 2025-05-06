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
  const [selectedTask, setSelectedTask] = useState(null);

  const token = localStorage.getItem("user_token");
  const API_KEY = process.env.REACT_APP_API_KEY;

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

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

  const handleCreateTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const updateTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setShowModal(true);
    }
  };

  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `${API_KEY}/api/tasks/deletetask/${taskId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        }
      );
      if (!response.ok) {
        console.error("Failed to delete task:", response.statusText);
        return;
      }
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

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

      <GetTask
        tasks={filteredTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        emptyImage={notasks}
        updateTask={updateTask}
      />

      {showModal && (
        <NewTaskModal
          onClose={() => {
            setShowModal(false);
            setSelectedTask(null);
          }}
          onCreate={handleCreateTask}
          selectedTask={selectedTask}
          onUpdate={handleUpdateTask}
        />
      )}
    </div>
  );
};

export default Tasks;
