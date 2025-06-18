// components/UserProfile.jsx
import React, { useEffect, useState } from "react";
import { User } from "lucide-react";
import "./Profile.css";
import { useUser } from "../../components/UserContext";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [editableUser, setEditableUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [updating, setUpdating] = useState(false);

  const id = localStorage.getItem("user_id");
  const token = localStorage.getItem("user_token");
  const API_KEY = process.env.REACT_APP_API_KEY;

  const { userInfo } = useUser();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(
          `${API_KEY}/api/users/getUserbyid/${userInfo.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setUser(data);
        setEditableUser(data);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditableUser((prev) => ({
      ...prev,
      [name]: name === "isActive" ? value === "true" : value,
    }));
  };

  const handleUpdate = async () => {
    setUpdating(true);
    try {
      const res = await fetch(`${API_KEY}/api/users/update/${userInfo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: editableUser.username,
          emailid: editableUser.emailid,
          role: editableUser.role,
          password: editableUser.password, // assuming password is editable
          // password: editableUser.password || user.password, // assuming password isn't shown or edited in UI
        }),
      });

      const responseText = await res.text();

      if (res.ok) {
        // Re-fetch user after update to get fresh copy
        setUser(editableUser);
        setIsEditing(false);
        alert(responseText || "User updated successfully!");
      } else {
        alert("Update failed: " + responseText);
      }
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Update error.");
    } finally {
      setUpdating(false);
    }
  };

  const handleCancel = () => {
    setEditableUser(user); // Revert changes
    setIsEditing(false);
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!user) return <div className="error">User not found</div>;

  return (
    <div className="user-profile-container">
      <h2>User Profile</h2>
      <div className="profile-card">
        <div className="icon-container">
          <User size={100} strokeWidth={1.5} />
        </div>
        <div className="details">
          <p>
            <strong>ID:</strong> {editableUser.id}
          </p>

          <p>
            <strong>Name:</strong>
            {isEditing ? (
              <input
                type="text"
                name="username"
                value={editableUser.username}
                onChange={handleChange}
              />
            ) : (
              <span> {editableUser.username}</span>
            )}
          </p>

          <p>
            <strong>password:</strong>
            {isEditing ? (
              <input
                type="password"
                name="password"
                value={editableUser.password}
                onChange={handleChange}
              />
            ) : (
              <span> {editableUser.password}</span>
            )}
          </p>

          <p>
            <strong>Email:</strong>
            {isEditing ? (
              <input
                type="email"
                name="emailid"
                value={editableUser.emailid}
                onChange={handleChange}
              />
            ) : (
              <span> {editableUser.emailid}</span>
            )}
          </p>

          <p>
            <strong>Role:</strong>
            {isEditing ? (
              <input
                type="text"
                name="role"
                value={editableUser.role}
                onChange={handleChange}
                disabled
              />
            ) : (
              <span> {editableUser.role}</span>
            )}
          </p>

          {/* <p>
            <strong>Status:</strong>
            {isEditing ? (
              <select
                name="isActive"
                value={editableUser.isActive}
                onChange={handleChange}
              >
                <option value={true}>active</option>
                <option value={false}>inactive</option>
              </select>
            ) : (
              <span> {editableUser.isActive ? "active" : "inactive"}</span>
            )}
          </p> */}

          {!isEditing ? (
            <button onClick={() => setIsEditing(true)}>Edit</button>
          ) : (
            <div className="edit-buttons">
              <button onClick={handleUpdate} disabled={updating}>
                {updating ? "Saving..." : "Save"}
              </button>
              <button onClick={handleCancel} className="cancel-btn">
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
