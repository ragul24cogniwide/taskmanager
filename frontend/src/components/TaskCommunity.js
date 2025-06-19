import React, { useEffect, useState } from "react";
import "./TaskCommunity.css";
import { X } from "lucide-react";

const TaskCommunity = () => {
  const [usersWithTasks, setUsersWithTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const API_KEY = process.env.REACT_APP_API_KEY;
  const token = localStorage.getItem("user_token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetch(`${API_KEY}/api/users/getallusers`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!usersResponse.ok) throw new Error("Failed to fetch users");
        const users = await usersResponse.json();

        const tasksResponse = await fetch(`${API_KEY}/api/tasks/getalltasks`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          credentials: "include",
        });

        if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
        const tasks = await tasksResponse.json();
        console.log("Fetched Tasks:", tasks);

        const usersWithTheirTasks = users.map((user) => {
          const userTasks = tasks.filter((task) => {
            // Case 1: task.user_id is null (self-assigned task)
            if (task.user_id === null) {
              return true; // Include self-assigned tasks (you may want to restrict this to the task creator if needed)
            }
            // Case 2: task.user_id is 0, compare task.user_id with user.id
            if (task.user_id === 0) {
              return task.user_id === user.id;
            }
            // Case 3: Otherwise, compare task.userid with user.id
            return task.userid === user.id;
          });
          return { ...user, tasks: userTasks };
        });

        setUsersWithTasks(usersWithTheirTasks);
      } catch (err) {
        console.error(err);
        setError("Unable to load community data.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const openModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <div className="community-loading">Loading...</div>;
  if (error) return <div className="community-error">{error}</div>;

  return (
    <div className="task-community-page">
      <h2 className="community-title">Task Community</h2>
      <p className="community-description">
        View tasks shared by all users in the community.
      </p>
      <div className="users-container">
        {usersWithTasks.map((user) => (
          <div className="user-card" key={user.id}>
            <h3>{user.username}</h3>
            <h5>{user.designation}</h5>
            <button className="view-button" onClick={() => openModal(user)}>
              View Tasks
            </button>
          </div>
        ))}
      </div>

      {showModal && selectedUser && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{selectedUser.username}'s Tasks</h3>
            <ul className="task-list">
              {selectedUser.tasks && selectedUser.tasks.length > 0 ? (
                selectedUser.tasks.map((task) => (
                  <li key={task.id} className="task-item">
                    <p>
                      <strong>Title:</strong> {task.title}
                    </p>
                    <p>
                      <strong>Description:</strong> {task.description}
                    </p>
                    <p><strong>Status</strong>{task.status}</p>
                    <p>
                      <strong>Assigned By:</strong> {task.assignedBy}
                    </p>
                    <p>
                      <strong>Assignment Type:</strong>{" "}
                      {task.user_id === null
                        ? "Self-assigned"
                        : task.userid === 0
                        ? "Assigned (userid=0)"
                        : "Assigned by userid"}
                    </p>
                  </li>
                ))
              ) : (
                <li className="no-task">No tasks found</li>
              )}
            </ul>
            <button className="close-button" onClick={closeModal}>
              <X size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCommunity;

// import React, { useEffect, useState } from "react";
// import "./TaskCommunity.css";
// import { X } from "lucide-react";

// const TaskCommunity = () => {
//   const [usersWithTasks, setUsersWithTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showModal, setShowModal] = useState(false);
//   const [selectedUser, setSelectedUser] = useState(null);

//   const API_KEY = process.env.REACT_APP_API_KEY;
//   const token = localStorage.getItem("user_token");

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const usersResponse = await fetch(`${API_KEY}/api/users/getallusers`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });

//         if (!usersResponse.ok) throw new Error("Failed to fetch users");
//         const users = await usersResponse.json();
//         // console.log("Fetched Users:", users);

//         const tasksResponse = await fetch(`${API_KEY}/api/tasks/getalltasks`, {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           credentials: "include",
//         });

//         if (!tasksResponse.ok) throw new Error("Failed to fetch tasks");
//         const tasks = await tasksResponse.json();
//         console.log("Fetched Tasks:", tasks);

//         const usersWithTheirTasks = users.map((user) => {
//           const userTasks = tasks.filter(
//             (task) => task.user_id === user.id || task.users?.id === user.id
//           );
//           return { ...user, tasks: userTasks };
//         });

//         setUsersWithTasks(usersWithTheirTasks);
//       } catch (err) {
//         console.error(err);
//         setError("Unable to load community data.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const openModal = (user) => {
//     setSelectedUser(user);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedUser(null);
//   };

//   if (loading) return <div className="community-loading">Loading...</div>;
//   if (error) return <div className="community-error">{error}</div>;

//   return (
//     <div className="task-community-page">
//       <h2 className="community-title">Task Community</h2>
//       <p className="community-description">
//         View tasks shared by all users in the community.
//       </p>
//       <div className="users-container">
//         {usersWithTasks.map((user) => (
//           <div className="user-card" key={user.id}>
//             <h3>{user.username}</h3>
//             <h5>{user.designation}</h5>
//             <button className="view-button" onClick={() => openModal(user)}>
//               View Tasks
//             </button>
//           </div>
//         ))}
//       </div>

//       {showModal && selectedUser && (
//         <div className="modal-overlay" onClick={closeModal}>
//           <div className="modal-content" onClick={(e) => e.stopPropagation()}>
//             <h3>{selectedUser.username}'s Tasks</h3>
//             <ul className="task-list">
//               {selectedUser.tasks && selectedUser.tasks.length > 0 ? (
//                 selectedUser.tasks.map((task) => (
//                   <li key={task.id} className="task-item">
//                     <p>
//                       <strong>Title:</strong> {task.title}
//                     </p>
//                     <p>
//                       <strong>Description:</strong> {task.description}
//                     </p>
//                     <p>
//                       <strong>Assigned By:</strong> {task.assignedBy}
//                     </p>
//                   </li>
//                 ))
//               ) : (
//                 <li className="no-task">No tasks found</li>
//               )}
//             </ul>
//             <button className="close-button" onClick={closeModal}>
//               <X size={12} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default TaskCommunity;
