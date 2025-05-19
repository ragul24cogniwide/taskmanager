import React, { useEffect, useState } from "react";
import "./GetAllUsers.css";
import NewTaskModal from "./NewTaskModal";

const API_KEY = process.env.REACT_APP_API_KEY;

const GetAllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null); // ✅ store selected user
  const [tasks, setTasks] = useState([]);

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
        setUsers(data);
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
      user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateTask = (newTask) => {
    setTasks((prev) => [...prev, newTask]);
  };

  const openTaskModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  return (
    <div className="main-content">
      <h2 className="text">All Users</h2>
      <p className="users-caption">
        Below is the list of users with options to assign tasks or view details
        by Admin.
      </p>
      <input
        type="text"
        placeholder="Search by username or email..."
        className="search-input"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.username}</td>
                  <td>{user.emailid}</td>
                  <td>
                    <button
                      className="assign-task-button"
                      onClick={() => openTaskModal(user)} // ✅ open modal
                    >
                      Assign Task
                    </button>
                    <button
                      className="assign-task-button-details"
                      onClick={() =>
                        console.log(`Viewing details for ${user.username}`)
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ✅ Show modal if triggered */}
      {showModal && selectedUser && (
        <NewTaskModal
          onCreate={handleCreateTask}
          onClose={() => setShowModal(false)}
          assignedUser={selectedUser} // ✅ pass user
        />
      )}
    </div>
  );
};

export default GetAllUsers;
