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
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import NewTaskModal from "./NewTaskModal";
import "./SlideBar.css";
import { useUser } from "./UserContext"; // Import UserContext

const SlideBar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  const { userInfo } = useUser(); // Access userInfo from UserContext

  console.log(userInfo.role, userInfo.id);

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

  // Then conditionally return

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleLogout = () => {
    localStorage.removeItem("user_token");
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

            {userInfo?.role === "USER" ||
              (userInfo?.role === "ADMIN" && (
                <li onClick={() => navigate("/ViewTasksByAdmin")}>
                  <CheckCheckIcon size={18} /> External Tasks
                </li>
              ))}

            <li onClick={() => navigate("/notification")}>
              <Bell size={18} /> Notification
            </li>

            <li onClick={() => navigate("/usersByAdmin")}>
              <User size={18} /> Users{" "}
              <span className="size-span">(Access)</span>
            </li>

            {userInfo?.role === "ADMIN" && (
              <>
                <li onClick={() => navigate("/requestAccess")}>
                  <CheckCheckIcon size={18} /> Request Access
                </li>
              </>
            )}

            <li onClick={() => navigate("/taskcommunity")}>
              <Users size={18} /> Task Community
            </li>

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
