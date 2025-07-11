import React from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import UsersList from "./components/UsersList";
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="container text-center mt-4">
        <h1 className="mb-4">User Management System</h1>
        <nav className="mb-4">
          <NavLink 
            to="/register" 
            className={({ isActive }) => "btn btn-outline-primary mx-2" + (isActive ? " active" : "")}
          >
            Register
          </NavLink>
          <NavLink 
            to="/login" 
            className={({ isActive }) => "btn btn-outline-primary mx-2" + (isActive ? " active" : "")}
          >
            Login
          </NavLink>
          <NavLink 
            to="/users" 
            className={({ isActive }) => "btn btn-outline-primary mx-2" + (isActive ? " active" : "")}
          >
            Users
          </NavLink>
        </nav>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile/:email" element={<Profile />} />
          <Route path="/users" element={<UsersList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
