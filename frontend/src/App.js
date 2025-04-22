import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages & Components
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Layout />}>
          <Route index element={<Tasks />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
