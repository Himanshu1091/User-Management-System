import React, { useEffect, useState } from "react";
import axios from "axios";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userEmail = localStorage.getItem("userEmail");
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    if (userRole !== "ADMIN") {
      setError("Access denied: Only admins can view this page.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8080/api/users?requesterEmail=${userEmail}`)
      .then((res) => {
        setUsers(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to fetch users");
        setLoading(false);
      });
  }, [userEmail, userRole]);

  const handleEdit = (user) => {
    setEditId(user.id);
    setFormData({ name: user.name, email: user.email, password: "", role: user.role });
  };

  const handleCancel = () => {
    setEditId(null);
    setFormData({ name: "", email: "", password: "", role: "USER" });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    axios
      .put(`http://localhost:8080/api/users/${editId}?requesterEmail=${userEmail}`, formData)
      .then(() => {
        return axios.get(`http://localhost:8080/api/users?requesterEmail=${userEmail}`);
      })
      .then((res) => {
        setUsers(res.data);
        setEditId(null);
      })
      .catch(() => alert("Failed to update user"));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    axios
      .delete(`http://localhost:8080/api/users/${id}?requesterEmail=${userEmail}`)
      .then(() => axios.get(`http://localhost:8080/api/users?requesterEmail=${userEmail}`))
      .then((res) => setUsers(res.data))
      .catch(() => alert("Failed to delete user"));
  };

  if (loading) return <p>Loading users...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container" style={{ maxWidth: 800, marginTop: 20 }}>
      <h2>All Users (Admin Only)</h2>
      <table className="table table-bordered">
        <thead className="table-light">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) =>
            editId === user.id ? (
              <tr key={user.id}>
                <td><input className="form-control" name="name" value={formData.name} onChange={handleChange} /></td>
                <td><input className="form-control" name="email" value={formData.email} onChange={handleChange} /></td>
                <td>
                  <select className="form-select" name="role" value={formData.role} onChange={handleChange}>
                    <option value="USER">USER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td><input className="form-control" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep unchanged" /></td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={handleSave}>Save</button>{" "}
                  <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                </td>
              </tr>
            ) : (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>******</td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => handleEdit(user)}>Edit</button>{" "}
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(user.id)}>Delete</button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;
