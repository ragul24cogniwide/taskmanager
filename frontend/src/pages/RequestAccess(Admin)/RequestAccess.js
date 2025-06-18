import React, { useEffect, useState } from "react";
import "./RequestAccess.css";

const RequestAccess = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_KEY = process.env.REACT_APP_API_KEY;
  const token = localStorage.getItem("user_token");
  // const user_id = localStorage.getItem("user_id");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_KEY}/api/users/getallusers`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch users");

        const data = await response.json();
        if (Array.isArray(data)) {
          const pendingUsers = data.filter((user) => user.status === "Pending");
          setUsers(pendingUsers);

          if (pendingUsers.length === 0) {
            setError("No users pending approval.");
          }
        } else {
          setError("Invalid data format received.");
        }
      } catch (err) {
        setError("Something went wrong while fetching users.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [API_KEY, token]);

  const handleAction = async (userId, action) => {
    try {
      const selectedUser = users.find((u) => u.id === userId);
      const response = await fetch(
        `${API_KEY}/api/users/updatestatus/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
          body: JSON.stringify({
            status: action,
            role: selectedUser.role,
          }),
        }
      );

      if (response.ok) {
        setUsers((prev) => prev.filter((user) => user.id !== userId));
      }
    } catch (err) {
      console.error(`Failed to ${action} user:`, err);
    }
  };

  if (loading) return <div className="center">Loading users...</div>;
  if (error) return <div className="error">{error}</div>;
  if (users.length === 0)
    return <div className="center">No users pending approval.</div>;

  return (
    <div className="approval-container">
      <h2>Pending User Approvals</h2>
      <div className="approval-table">
        <div className="approval-header">
          <div>User ID</div>
          <div>Username</div>
          <div>Email</div>
          <div>Designation</div>
          <div>Role</div>
          <div>Action</div>
        </div>
        {users.map((user) => (
          <div key={user.id} className="approval-row">
            <div>{user.id}</div>
            <div>{user.username}</div>
            <div>{user.emailid}</div>
            <div>{user.designation}</div>
            <div>
              <select
                value={user.role}
                onChange={(e) =>
                  setUsers((prevUsers) =>
                    prevUsers.map((u) =>
                      u.id === user.id ? { ...u, role: e.target.value } : u
                    )
                  )
                }
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="button-group">
              <button
                className="approve-btn"
                onClick={() => handleAction(user.id, "Approved")}
              >
                Approve
              </button>
              <button
                className="reject-btn"
                onClick={() => handleAction(user.id, "Rejected")}
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RequestAccess;
