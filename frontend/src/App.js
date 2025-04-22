import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages & Components
import Layout from "./components/Layout";
import Tasks from "./pages/Tasks";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Tasks />} />
          {/* <Route path="task" element={<Tasks />} /> */}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
