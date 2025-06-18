import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Home,
  CheckSquare,
  CheckCheckIcon,
  User2Icon,
  Bell,
  Plus,
  LogOut,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewTaskModal from "./NewTaskModal";
import "./SlideBar.css";

const SlideBar = ({ Role, userid }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (mobile) setIsOpen(false);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("Role");
    navigate("/");
  };

  const handleCreateTask = (task) => {
    const newTask = {
      id: Date.now(),
      ...task,
      completed: false,
      createdAt: new Date(),
    };
    setTasks((prev) => [...prev, newTask]);
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
          <h2 className="sidebar-title">Focus-Track</h2>

          <button onClick={() => setShowModal(true)} className="Add-button">
            <Plus size={18} /> Add Task
          </button>

          <ul className="sidebar-list">
            <li onClick={() => navigate("/dashboard")}>
              <Home size={18} /> DashBoard
            </li>

            <li onClick={() => navigate("/home")}>
              <CheckSquare size={18} /> My Tasks
            </li>

            {Role === "USER" && (
              <li onClick={() => navigate("/ViewTasksByAdmin")}>
                <CheckCheckIcon size={18} /> Tasks{" "}
                <span className="size-span">(By Admin)</span>
              </li>
            )}

            <li onClick={() => navigate("/notification")}>
              <Bell size={18} /> Notification
            </li>

            {Role === "ADMIN" && (
              <>
                <li onClick={() => navigate("/usersByAdmin")}>
                  <User size={18} /> Users{" "}
                  <span className="size-span">(Admin Access)</span>
                </li>
                <li onClick={() => navigate("/requestAccess")}>
                  <CheckCheckIcon size={18} /> Request Access
                </li>
              </>
            )}

            <li onClick={() => navigate("/profile")}>
              <User2Icon size={18} /> Profile
            </li>

            <li onClick={handleLogout}>
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
