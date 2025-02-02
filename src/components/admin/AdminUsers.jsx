import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../constant";
import CRUDTable from "./CRUDTable";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
      setError("");
    } catch (error) {
      const message = error.response?.data?.message || "Error fetching users";
      setError(message);
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setSelectedUser(null);
    setError("");
    setShowPassword(true);
    setShowModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setError("");
    setShowPassword(false);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/api/users/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchUsers();
        setError("");
      } catch (error) {
        const message = error.response?.data?.message || "Error deleting user";
        setError(message);
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.target);
    const userData = {
      username: formData.get("username"),
      email: formData.get("email"),
      userRole: formData.get("userRole"),
    };

    // Only include password if it's provided (for new users or if changed)
    const password = formData.get("password");
    if (password) {
      userData.password = password;
    }

    try {
      if (selectedUser) {
        await axios.put(`${API_URL}/api/users/${selectedUser._id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`${API_URL}/api/users/register`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      setShowModal(false);
      setError("");
      fetchUsers();
    } catch (error) {
      const message = error.response?.data?.message || "Error saving user";
      setError(message);
      console.error("Error saving user:", error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { key: "username", label: "Username" },
    { key: "email", label: "Email" },
    { key: "userRole", label: "Role" },
  ];

  return (
    <>
      <CRUDTable
        data={users}
        columns={columns}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
        title="Users Management"
        loading={loading}
      />

      {/* User Form Modal */}
      <div
        className={`modal fade ${showModal ? "show d-block" : ""}`}
        tabIndex="-1"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedUser ? "Edit User" : "Add New User"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setShowModal(false)}
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body">
                {error && (
                  <div
                    className="alert alert-danger alert-dismissible fade show"
                    role="alert"
                  >
                    {error}
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setError("")}
                    ></button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    name="username"
                    defaultValue={selectedUser?.username}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    name="email"
                    defaultValue={selectedUser?.email}
                    required
                  />
                </div>
                {(!selectedUser || showPassword) && (
                  <div className="mb-3">
                    <label className="form-label">
                      Password{" "}
                      {selectedUser && "(Leave blank to keep current password)"}
                    </label>
                    <div className="input-group">
                      <input
                        type="password"
                        className="form-control form-control-lg"
                        name="password"
                        required={!selectedUser}
                      />
                      {selectedUser && (
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => setShowPassword(false)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                )}
                {selectedUser && !showPassword && (
                  <div className="mb-3">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={() => setShowPassword(true)}
                    >
                      Change Password
                    </button>
                  </div>
                )}
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className="form-select form-select-lg"
                    name="userRole"
                    defaultValue={selectedUser?.userRole || "NORMAL"}
                    required
                  >
                    <option value="NORMAL">Normal User</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary btn-lg"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      {selectedUser ? "Updating..." : "Creating..."}
                    </>
                  ) : selectedUser ? (
                    "Update"
                  ) : (
                    "Create"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Modal Background Overlay */}
      {showModal && (
        <div
          className="modal-backdrop fade show"
          onClick={() => !loading && setShowModal(false)}
        ></div>
      )}
    </>
  );
};

export default AdminUsers;
