import React, { useEffect, useState } from "react";
import "./GetAllUsers.css";
import NewTaskModal from "./NewTaskModal";
import { Search } from "lucide-react";
import { useUser } from "../components/UserContext";

const API_KEY = process.env.REACT_APP_API_KEY;

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  const { userInfo } = useUser();
  console.log("User Role:", userInfo.role);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("user_token");
        const response = await fetch(`${API_KEY}/api/users/getallusers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const data = await response.json();

        // Filter users: exclude Pending and Rejected
        const filtered = data.filter(
          (user) =>
            user.status !== "Pending" &&
            user.status !== "Rejected" &&
            user.id != 1
        );

        setUsers(filtered);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.emailid?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.designation?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const openTaskModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  // Group users by role
  const groupedUsers = {
    Admin: filteredUsers.filter((user) => user.role === "ADMIN"),
    User: filteredUsers.filter((user) => user.role === "USER"),
  };

  return (
    <div className="main-content">
      <h2 className="text">All Users</h2>
      <p className="users-caption">
        View list of Admins and Users. Assign tasks if you're an Admin.
      </p>

      <div className="search-container">
        <input
          type="text"
          placeholder="Search by username or email..."
          className="search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="search-icon" size={20} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          {userInfo.role === "ADMIN" && (
            <>
              <h3 className="role-heading">Admins</h3>
              <div className="table-wrapper">
                <table className="user-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Designation</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedUsers.Admin.length > 0 ? (
                      groupedUsers.Admin.map((user) => (
                        <tr key={user.id}>
                          <td>{user.id}</td>
                          <td>{user.username}</td>
                          <td>{user.emailid}</td>
                          <td>{user.designation}</td>
                          <td>
                            <button
                              className="assign-task-button"
                              onClick={() => openTaskModal(user)}
                            >
                              Assign Task
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5">No admins found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Always show Users table for both roles */}
          <h3 className="role-heading">Users</h3>
          <div className="table-wrapper">
            <table className="user-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Designation</th>
                  {/* {userInfo.role === "ADMIN" && <th>Actions</th>} */}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {groupedUsers.User.length > 0 ? (
                  groupedUsers.User.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.username}</td>
                      <td>{user.emailid}</td>
                      <td>{user.designation}</td>
                      {/* {userInfo.role === "ADMIN" && ( */}
                      <td>
                        <button
                          className="assign-task-button"
                          onClick={() => openTaskModal(user)}
                        >
                          Assign Task
                        </button>
                      </td>
                      {/* )} */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={userInfo.role === "ADMIN" ? "5" : "4"}>
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {showModal && selectedUser && (
        <NewTaskModal
          onCreate={handleCreateTask}
          onClose={() => setShowModal(false)}
          assignedUser={selectedUser}
        />
      )}
    </div>
  );
};

export default GetAllUsers;
