import { useState, useEffect, useCallback } from "react";
import { useUser } from "../context/UserContext";
import { useAuth } from "../context/authContext";
import "./UserList.css";
import Header from "../components/Header";
import SideBar from "../components/SideBar";
import { useNavigate } from "react-router-dom";

/**
 * UserList
 * Admin component — lists all users on the marketer's platform
 * with search, filter, pagination, and quick actions.
 */
const UserList = () => {
  const {
    users,
    loading,
    pagination,
    getAllUsers,
    suspendUser,
    activateUser,
    deleteUser,
    changeUserRole,
  } = useUser();

  const { notify } = useAuth();

  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(null); // user for action modal
  const [modal, setModal] = useState(""); // "suspend"|"activate"|"delete"|"role"
  const [newRole, setNewRole] = useState("");
  const [acting, setActing] = useState(false);

  /* ── Fetch on filter/page change ── */
  const fetchUsers = useCallback(() => {
    getAllUsers({ page, search, role, status });
  }, [page, search, role, status, getAllUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  /* ── Debounce search ── */
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(1);
      fetchUsers();
    }, 500);
    return () => clearTimeout(t);
  }, [search]);

  /* ── Actions ── */
  const handleAction = async () => {
    if (!selected) return;
    setActing(true);
    let result;

    if (modal === "suspend") result = await suspendUser(selected._id);
    if (modal === "activate") result = await activateUser(selected._id);
    if (modal === "delete") result = await deleteUser(selected._id);
    if (modal === "role") result = await changeUserRole(selected._id, newRole);

    if (result?.status) {
      notify("success", result.message || "Action completed.");
    } else {
      notify("error", result?.message || "Action failed.");
    }

    setActing(false);
    setModal("");
    setSelected(null);
  };

  const statusBadge = (s) => (
    <span className={`ul-badge ul-badge--${s}`}>{s}</span>
  );

  const roleBadge = (r) => <span className={`ul-role ul-role--${r}`}>{r}</span>;

  return (
    <div className="users-list-container">
      <SideBar />
      <div className="ul-wrapper">
        <Header />
        {/* ── Filters ── */}
        <div className="ul-filters">
          <input
            className="ul-search"
            type="text"
            placeholder="Search by name, username, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="ul-select"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="reseller">Reseller</option>
            <option value="marketer">Marketer</option>
            {/* <option value="admin">Admin</option> */}
          </select>

          <select
            className="ul-select"
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>

          <button
            className="ul-refresh-btn"
            onClick={fetchUsers}
            title="Refresh"
          >
            ↻
          </button>
        </div>

        {/* ── Summary ── */}
        <p className="ul-summary">
          Showing <strong>{users.length}</strong> of{" "}
          <strong>{pagination.total}</strong> users
        </p>

        {/* ── Table ── */}
        {loading ? (
          <div className="ul-loading">
            <div className="ul-spinner" />
            <p>Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="ul-empty">
            <span>👥</span>
            <p>No users found.</p>
          </div>
        ) : (
          <div className="ul-table-wrapper">
            <table className="ul-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr
                    key={u._id}
                    className="ul-row-link"
                    onClick={() => navigate(`/marketer/users/${u._id}`)}
                  >
                    <td className="ul-name">{u.fullName}</td>
                    <td>{u.username}</td>
                    <td>{u.email}</td>
                    <td>{u.phone}</td>
                    <td>{roleBadge(u.role)}</td>
                    <td>{statusBadge(u.status)}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Pagination ── */}
        {pagination.totalPages > 1 && (
          <div className="ul-pagination">
            <button
              className="ul-page-btn"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="ul-page-info">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              className="ul-page-btn"
              disabled={page >= pagination.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        )}

        {/* ── Action Modal ── */}
        {modal && selected && (
          <div
            className="ul-modal-overlay"
            onClick={() => {
              setModal("");
              setSelected(null);
            }}
          >
            <div className="ul-modal" onClick={(e) => e.stopPropagation()}>
              <div className="ul-modal-header">
                <h3>
                  {modal === "suspend" && "Suspend User"}
                  {modal === "activate" && "Activate User"}
                  {modal === "delete" && "Delete User"}
                  {modal === "role" && "Change Role"}
                </h3>
                <button
                  className="ul-modal-close"
                  onClick={() => {
                    setModal("");
                    setSelected(null);
                  }}
                >
                  ×
                </button>
              </div>

              <div className="ul-modal-body">
                {modal === "role" ? (
                  <>
                    <p>
                      Change role for <strong>{selected.fullName}</strong>:
                    </p>
                    <select
                      className="ul-select ul-select--full"
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="reseller">Reseller</option>
                      <option value="marketer">Marketer</option>
                      <option value="admin">Admin</option>
                    </select>
                  </>
                ) : (
                  <p>
                    Are you sure you want to <strong>{modal}</strong>{" "}
                    <strong>{selected.fullName}</strong>?
                    {modal === "delete" && " This action cannot be undone."}
                  </p>
                )}
              </div>

              <div className="ul-modal-footer">
                <button
                  className="ul-modal-btn ul-modal-btn--cancel"
                  onClick={() => {
                    setModal("");
                    setSelected(null);
                  }}
                >
                  Cancel
                </button>
                <button
                  className={`ul-modal-btn ${modal === "delete" ? "ul-modal-btn--danger" : "ul-modal-btn--confirm"}`}
                  onClick={handleAction}
                  disabled={acting}
                >
                  {acting ? "Processing..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserList;
