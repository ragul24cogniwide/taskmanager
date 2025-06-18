import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  CheckSquare,
  CheckCheckIcon,
  User2Icon,
  Calendar,
  BarChart,
  Plus,
  LogOut,
  User,
  Bell,
} from "lucide-react";
import "./SlideBar.css";
import { useNavigate } from "react-router-dom";

import NewTaskModal from "./NewTaskModal"; // Import the modal component

const SlideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
      if (window.innerWidth <= 768) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handlelogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
    navigate("/");
  };

  const handleCreateTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      createdAt: new Date(),
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <>
      {!isOpen && (
        <button className="toggle-btn" onClick={toggleSidebar}>
          <Menu size={18} />
        </button>
      )}

      <div className={`sidebar ${isOpen ? "open" : ""}`}>
        {isOpen && (
          <button className="close-btn" onClick={toggleSidebar}>
            <X size={18} />
          </button>
        )}

        <div className="sidebar-content">
          <h2>Focus-Track</h2>
          <button onClick={() => setShowModal(true)} className="Add-button">
            <Plus size={18} /> Add Task
          </button>
          <ul>
            <li onClick={() => navigate("/dashboard")}>
              <Home size={18} /> DashBoard
            </li>

            <li onClick={() => navigate("/home")}>
              <CheckSquare size={18} /> Tasks
            </li>

            {localStorage.getItem("user_id") != "1" && (
              <li onClick={() => navigate("/ViewTasksByAdmin")}>
                <CheckCheckIcon size={18} />
                Tasks
                <span className="size-span">(ByAdmin)</span>
              </li>
            )}

            <li onClick={() => navigate("/notification")}>
              <Bell size={18} />
              Notification
            </li>

            {/* <li onClick={() => navigate("/calendar")}>
              <Calendar size={18} /> Calendar
            </li>
            <li>
              <BarChart size={18} /> Reports
            </li> */}

            {localStorage.getItem("user_id") === "1" && (
              <li onClick={() => navigate("/usersByAdmin")}>
                <User size={18} />
                Users
                <span className="size-span">(Admin Acess)</span>
              </li>
            )}

            {localStorage.getItem("user_id") === "1" && (
              <li onClick={() => navigate("/requestAccess")}>
                <CheckCheckIcon size={18} />
                Request Access
                {/* <span className="size-span">(Admin Acess)</span> */}
              </li>
            )}

            <li onClick={() => navigate("/profile")}>
              <User2Icon size={18} /> Profile
            </li>

            <li onClick={() => handlelogout()}>
              <LogOut size={18} /> Logout
            </li>
          </ul>
        </div>
      </div>
      {showModal && (
        <NewTaskModal
          onClose={() => setShowModal(false)}
          onCreate={handleCreateTask}
        />
      )}
    </>
  );
};

export default SlideBar;
