import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Auth/Login";
import Home from "./components/Home/Home";
import Log from "./components/Log/Log";

const App = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/log" element={<Log />} />
    </Routes>
  </Router>
);

export default App;
