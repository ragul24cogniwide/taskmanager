import React, { useState, useEffect } from "react";
import notasks from "../assests/no-tasks-removebg-preview.png";
import NewTaskModal from "../components/NewTaskModal";
import GetTask from "../components/GetTask";
import { Plus } from "lucide-react";
import "./Tasks.css";
import { parse, format } from "date-fns";

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [filterMode, setFilterMode] = useState("all"); // all, admin
  const [statusFilter, setStatusFilter] = useState("all"); // all, pending, inprogress, completed
  const [dateFilter, setDateFilter] = useState(""); // Format: YYYY-MM-DD
  const [priorityFilter, setPriorityFilter] = useState("all"); // low, medium, high

  const token = localStorage.getItem("user_token");
  const user_id = localStorage.getItem("user_id");
  const API_KEY = process.env.REACT_APP_API_KEY;

  // Track screen size for responsiveness
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  // Fetch tasks from API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
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
  }, [API_KEY, token, user_id]);

  // Create task
  const handleCreateTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  // Prepare to edit task
  const updateTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setSelectedTask(taskToEdit);
      setShowModal(true);
    }
  };

  // Update task after edit
  const handleUpdateTask = (updatedTask) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  // Toggle complete/incomplete
  const toggleTaskCompletion = (taskId) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Delete task
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
      window.alert("Task deleted successfully");
      setTasks(tasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title && task.title.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAdminFilter =
      filterMode === "admin" ? task.userid === parseInt(user_id) : true;

    const matchesStatusFilter =
      filterMode === "pending"
        ? task.status?.toLowerCase() === "pending"
        : filterMode === "inprogress"
        ? task.status?.toLowerCase() === "in progress"
        : filterMode === "completed"
        ? task.status?.toLowerCase() === "completed"
        : true;

    //Date filter logic is not working properly
    const matchesDateFilter =
      dateFilter === "" ? true : task.dueDate === dateFilter;

    const matchesPriorityFilter =
      priorityFilter === "all"
        ? true
        : task.priority?.toLowerCase() === priorityFilter.toLowerCase();

    return (
      matchesSearch &&
      matchesAdminFilter &&
      matchesStatusFilter &&
      matchesDateFilter &&
      matchesPriorityFilter
    );
  });

  return (
    <>
      <div className="tasks-container">
        <div className="tasks-header1">
          <div className="tasks-header-text">
            <h1>Task Manager</h1>
            <p>Organize and manage your tasks efficiently</p>
          </div>
        </div>

        {/* Search and Add */}
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

        {/* Filter Section */}
        <div className="filter-toggle">
          <button
            className={filterMode === "all" ? "active-filter" : ""}
            onClick={() => setFilterMode("all")}
          >
            All Tasks
          </button>

          <button
            className={filterMode === "pending" ? "active-filter" : ""}
            onClick={() => setFilterMode("pending")}
          >
            Pending
          </button>
          <button
            className={filterMode === "inprogress" ? "active-filter" : ""}
            onClick={() => setFilterMode("inprogress")}
          >
            In Progress
          </button>
          <button
            className={filterMode === "completed" ? "active-filter" : ""}
            onClick={() => setFilterMode("completed")}
          >
            Completed
          </button>

          <div className="filter-section">
            {/* Date Filter */}
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-date"
            />

            {/* Priority Filter */}
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-priority"
            >
              <option value="all">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>

        {/* Task List Display */}
        <GetTask
          tasks={filteredTasks}
          toggleTaskCompletion={toggleTaskCompletion}
          deleteTask={deleteTask}
          emptyImage={notasks}
          updateTask={updateTask}
        />

        {/* Modal */}
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
      {/* <ViewTasksAdmin tasks={tasks} /> */}
    </>
  );
};

export default Tasks;
