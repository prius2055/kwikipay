import { createContext, useContext, useState, useCallback } from "react";
import { BASE_URL, getHeaders } from "../api/api";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  /* ── State ── */
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userLoading, setUserLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 1,
  });

  /* ════════════════════════════════════════════════
     GET ALL USERS (admin — scoped to marketer)
  ════════════════════════════════════════════════ */
  const getAllUsers = useCallback(
    async ({
      page = 1,
      limit = 20,
      search = "",
      role = "",
      status = "",
    } = {}) => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          page,
          limit,
          ...(search && { search }),
          ...(role && { role }),
          ...(status && { status }),
        });

        const response = await fetch(`${BASE_URL}/marketer/users?${params}`, {
          headers: getHeaders(true),
        });

        const data = await response.json();

        if (response.ok && data.status === "success") {
          setUsers(data.data || []);
          setPagination({
            total: data.meta?.total || 0,
            page: data.meta?.page || 1,
            limit: data.meta?.limit || limit,
            totalPages: data.meta?.totalPages || 1,
          });
          return { status: true };
        }

        return { status: false, message: data.message };
      } catch (error) {
        return { status: false, message: error.message };
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  /* ════════════════════════════════════════════════
     GET SINGLE USER
  ════════════════════════════════════════════════ */
  const getUser = useCallback(async (userId) => {
    setUserLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/marketer/users/${userId}`, {
        headers: getHeaders(true),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const fetchedUser = data.data?.user || data.user;
        setUser(fetchedUser);
        return { status: true, user: fetchedUser };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setUserLoading(false);
    }
  }, []);

  /* ════════════════════════════════════════════════
     UPDATE USER
  ════════════════════════════════════════════════ */
  const updateUser = async (userId, updates) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify(updates),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        const updatedUser = data.data?.user || data.user;

        // update in list
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? updatedUser : u)),
        );

        // update single user view if open
        if (user?._id === userId) setUser(updatedUser);

        return { status: true, user: updatedUser };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     SUSPEND USER
  ════════════════════════════════════════════════ */
  const suspendUser = async (userId) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}/suspend`,
        {
          method: "PATCH",
          headers: getHeaders(true),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, status: "suspended" } : u,
          ),
        );
        if (user?._id === userId)
          setUser((prev) => ({ ...prev, status: "suspended" }));
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     ACTIVATE USER
  ════════════════════════════════════════════════ */
  const activateUser = async (userId) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}/activate`,
        {
          method: "PATCH",
          headers: getHeaders(true),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, status: "active" } : u)),
        );
        if (user?._id === userId)
          setUser((prev) => ({ ...prev, status: "active" }));
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     DELETE USER
  ════════════════════════════════════════════════ */
  const deleteUser = async (userId) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}`, {
        method: "DELETE",
        headers: getHeaders(true),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setUsers((prev) => prev.filter((u) => u._id !== userId));
        if (user?._id === userId) setUser(null);
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     CHANGE USER ROLE
  ════════════════════════════════════════════════ */
  const changeUserRole = async (userId, role) => {
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ role }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setUsers((prev) =>
          prev.map((u) => (u._id === userId ? { ...u, role } : u)),
        );
        if (user?._id === userId) setUser((prev) => ({ ...prev, role }));
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     RESET USER PASSWORD (admin)
  ════════════════════════════════════════════════ */
  const adminResetUserPassword = async (userId, newPassword) => {
    setActionLoading(true);
    try {
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}/reset-password`,
        {
          method: "PATCH",
          headers: getHeaders(true),
          body: JSON.stringify({ newPassword }),
        },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     CREDIT / DEBIT USER WALLET (admin)
  ════════════════════════════════════════════════ */
  const adjustUserWallet = async (userId, { amount, type, reason }) => {
    // type: "credit" | "debit"
    setActionLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/admin/users/${userId}/wallet`, {
        method: "PATCH",
        headers: getHeaders(true),
        body: JSON.stringify({ amount, type, reason }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { status: true, message: data.message };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    } finally {
      setActionLoading(false);
    }
  };

  /* ════════════════════════════════════════════════
     GET USER TRANSACTIONS (admin view)
  ════════════════════════════════════════════════ */
  const getUserTransactions = async (userId, { page = 1, limit = 20 } = {}) => {
    try {
      const params = new URLSearchParams({ page, limit });
      const response = await fetch(
        `${BASE_URL}/admin/users/${userId}/transactions?${params}`,
        { headers: getHeaders(true) },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        return {
          status: true,
          transactions: data.data?.transactions || data.transactions || [],
          total: data.data?.total || data.total || 0,
        };
      }

      return { status: false, message: data.message };
    } catch (error) {
      return { status: false, message: error.message };
    }
  };

  /* ════════════════════════════════════════════════
     SEARCH USERS (lightweight — no pagination state)
  ════════════════════════════════════════════════ */
  const searchUsers = async (query) => {
    try {
      const response = await fetch(
        `${BASE_URL}/admin/users?search=${encodeURIComponent(query)}&limit=10`,
        { headers: getHeaders(true) },
      );

      const data = await response.json();

      if (response.ok && data.status === "success") {
        return { status: true, users: data.data?.users || data.users || [] };
      }

      return { status: false, message: data.message, users: [] };
    } catch (error) {
      return { status: false, message: error.message, users: [] };
    }
  };

  /* ════════════════════════════════════════════════
     CLEAR SELECTED USER
  ════════════════════════════════════════════════ */
  const clearUser = () => setUser(null);

  /* ════════════════════════════════════════════════
     CONTEXT VALUE
  ════════════════════════════════════════════════ */
  return (
    <UserContext.Provider
      value={{
        /* ── State ── */
        users,
        user,
        loading,
        userLoading,
        actionLoading,
        pagination,

        /* ── Actions ── */
        getAllUsers,
        getUser,
        updateUser,
        suspendUser,
        activateUser,
        deleteUser,
        changeUserRole,
        adminResetUserPassword,
        adjustUserWallet,
        getUserTransactions,
        searchUsers,
        clearUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
