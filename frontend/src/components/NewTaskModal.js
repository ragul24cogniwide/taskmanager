import React, { useState, useEffect } from "react";
import "./NewTaskModal.css";

const NewTaskModal = ({
  onClose,
  onCreate,
  onUpdate,
  selectedTask,
  assignedUser,
}) => {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    category: "Personal",
    priority: "Medium",
    status: "Pending",
    dueDate: "",
    assignedBy: "USER",
    user_id: "",
  });

  useEffect(() => {
    const loggedInUserId = localStorage.getItem("user_id");
    const isAdmin = loggedInUserId === "1";

    if (selectedTask) {
      setTaskData({
        ...selectedTask,
        user_id: selectedTask.user_id ?? assignedUser?.id,
        assignedBy: selectedTask.assignedBy ?? (isAdmin ? "ADMIN" : "USER"),
      });
    } else if (assignedUser?.id) {
      setTaskData((prev) => ({
        ...prev,
        assignedBy: isAdmin ? "ADMIN" : "USER",
        user_id: assignedUser.id,
      }));
    }
  }, [selectedTask, assignedUser]);

  useEffect(() => {
    if (selectedTask) {
      setTaskData(selectedTask);
    }
  }, [selectedTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const API_KEY = process.env.REACT_APP_API_KEY;

  const handleSubmit = async () => {
    if (taskData.title.trim()) {
      const loggedInUserId = localStorage.getItem("user_id");

      if (!taskData.user_id && assignedUser?.id) {
        taskData.user_id = assignedUser.id;
      }

      console.log("Submitting task data:", taskData); // Confirm it includes user_id

      try {
        const token = localStorage.getItem("user_token");
        if (!token) {
          console.error("No authentication token found");
          return;
        }

        const response = await fetch(`${API_KEY}/api/tasks/createtaskbyAdmin`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(taskData),
          credentials: "include",
        });

        if (response.ok) {
          const result = await response.text();
          console.log("Task created successfully:", result);
          onCreate(result);
          onClose();
        } else {
          const errorText = await response.text();
          console.error("Failed to create task:", response.status, errorText);
        }
      } catch (error) {
        console.error("Error creating task:", error);
      }
    } else {
      console.error("Task title cannot be empty");
    }
  };
  

  const handleUpdate = async () => {
    if (taskData.title.trim()) {
      try {
        const token = localStorage.getItem("user_token");
        if (!token) return;

        const response = await fetch(
          `${API_KEY}/api/tasks/updatetask/${taskData.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(taskData),
            credentials: "include",
          }
        );

        if (response.ok) {
          const result = await response.text();
          onUpdate(result);
          onClose();
        }
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{selectedTask ? "Update Task" : "Create New Task"}</h2>

        <div className="form-group">
          <label>Title</label>
          <input
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Task title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            name="description"
            value={taskData.description}
            onChange={handleChange}
            placeholder="Task description"
          />
        </div>

        <div className="form-group">
          <label>Assigned By</label>
          <input
            type="text"
            name="assignedBy"
            value={taskData.assignedBy}
            readOnly // make it read-only
          />
        </div>

        <div className="row">
          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={taskData.category}
              onChange={handleChange}
            >
              <option>Personal</option>
              <option>Work</option>
              <option>Finance</option>
              <option>Health</option>
            </select>
          </div>
          <div className="form-group">
            <label>Priority</label>
            <select
              name="priority"
              value={taskData.priority}
              onChange={handleChange}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <label>Status</label>
            <select
              name="status"
              value={taskData.status}
              onChange={handleChange}
            >
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              name="dueDate"
              value={taskData.dueDate}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>User By ID</label>
            <input
              type="text"
              name="user_id"
              value={taskData.user_id}
              readOnly
            />
          </div>
        </div>

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          {selectedTask ? (
            <button onClick={handleUpdate}>Update Task</button>
          ) : (
            <button onClick={handleSubmit}>Create Task</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NewTaskModal;
