import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages & Components
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

// import CalendarView from "./pages/CalendarView";
import GetAllUsers from "./components/GetAllUsers";
import Dashboard from "./pages/Dashboard/Dashoard";
import Notifications from "./pages/Notification/Notifications";
import Profile from "./pages/Profile/Profile";
import ViewTasksAdmin from "./components/ViewTasksAdmin";
import RequestAccess from "./pages/RequestAccess(Admin)/RequestAccess";
import { UserProvider } from "./components/UserContext"; // Import UserContext

function App() {
  return (
    <>
      <UserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Use element with Layout for both home and dashboard */}
            <Route path="/home" element={<Layout />}>
              <Route index element={<Tasks />} />
            </Route>

            {/* Separate route for dashboard with Layout wrapper */}
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<Dashboard />} />
            </Route>

            {/* <Route path="/calendar" element={<Layout />}>
          <Route index element={<CalendarView />} />
        </Route> */}

            <Route path="/usersByAdmin" element={<Layout />}>
              <Route index element={<GetAllUsers />} />
            </Route>

            <Route path="/notification" element={<Layout />}>
              <Route index element={<Notifications />} />
            </Route>

            <Route path="/profile" element={<Layout />}>
              <Route index element={<Profile />} />
            </Route>

            <Route path="/viewtasksByAdmin" element={<Layout />}>
              <Route index element={<ViewTasksAdmin />} />
            </Route>

            <Route path="/requestAccess" element={<Layout />}>
              <Route index element={<RequestAccess />} />
            </Route>

            <Route path="*" element={<h1>404 Not Found</h1>} />
            {/* Catch-all route for any undefined paths */}
          </Routes>
        </Router>
      </UserProvider>
    </>
  );
}

export default App;
