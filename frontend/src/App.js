import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./Pages/Homepage";
import SchedulePage from "./Pages/SchedulePage";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/schedule" element={<SchedulePage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
