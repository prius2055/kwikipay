import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";
import { BASE_URL, getHeaders } from "../api/api";

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [totalFunded, setTotalFunded] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ── NEW: virtual accounts from PaymentPoint ── */
  const [virtualAccounts, setVirtualAccounts] = useState([]);
  const [accountsLoading, setAccountsLoading] = useState(false);

  const token = localStorage.getItem("token");

  const networkOrder = useMemo(
    () => ({
      MTN: 1,
      AIRTEL: 2,
      GLO: 3,
      "9MOBILE": 4,
    }),
    [],
  );

  /* ─────────────────────────────────────────────────────────
   * REFRESH WALLET
   * ───────────────────────────────────────────────────────── */
  const refreshWallet = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/wallet/get`, {
        headers: getHeaders(),
      });

      const data = await response.json();

      if (data.status === "success") {
        const wallet = data.data.wallet;
        setBalance(wallet.balance);
        setTotalFunded(wallet.totalFunded);
        setTotalSpent(wallet.totalSpent);

        // ✅ Restore virtual accounts if they already exist on the wallet
        if (wallet.virtualAccounts?.length > 0) {
          setVirtualAccounts(wallet.virtualAccounts);
        }
      }
    } catch (error) {
      console.error("refreshWallet error:", error.message);
    } finally {
      setLoading(false);
    }
  }, [token]);

  /* ─────────────────────────────────────────────────────────
   * FUND WALLET — PaymentPoint virtual account
   *
   * No redirect. Calls backend to create (or retrieve existing)
   * virtual account. Returns the account details to show the user.
   *
   * Usage in component:
   *   const { fundWallet, virtualAccounts, accountsLoading } = useWallet();
   *   await fundWallet();
   *   // then render virtualAccounts to show user where to transfer
   * ───────────────────────────────────────────────────────── */
  const fundWallet = async () => {
    setAccountsLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/wallet/fund`, {
        method: "POST",
        headers: getHeaders(),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to get virtual account.");
      }

      // ✅ Save virtual accounts to state — show these to the user
      setVirtualAccounts(data.data.virtualAccounts);

      return {
        success: true,
        virtualAccounts: data.data.virtualAccounts,
      };
    } catch (error) {
      console.error("fundWallet error:", error.message);
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setAccountsLoading(false);
    }
  };

  const verifyWalletFunding = async () => {
    await refreshWallet(); // just refresh — balance comparison handled in component
  };

  /* ─────────────────────────────────────────────────────────
   * FETCH DATA PLANS
   * ───────────────────────────────────────────────────────── */
  const fetchDataPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/vtu/data-plans`, {
        method: "GET",
        headers: getHeaders(),
      });
      const data = await response.json();

      if (data.status === "success") {
        const sortedPlans = data.data.sort((a, b) => {
          const orderA = networkOrder[a.network?.toUpperCase()] ?? 99;
          const orderB = networkOrder[b.network?.toUpperCase()] ?? 99;
          return orderA - orderB;
        });

        const groupedByNetwork = sortedPlans.reduce((acc, plan) => {
          acc[plan.network] = acc[plan.network] || [];
          acc[plan.network].push(plan);
          return acc;
        }, {});

        setDataPlans(groupedByNetwork);
      }
    } catch (error) {
      setError("Failed to fetch data plans");
    } finally {
      setLoading(false);
    }
  }, [networkOrder]);

  /* ─────────────────────────────────────────────────────────
   * BUY DATA
   * ───────────────────────────────────────────────────────── */
  const buyData = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/buy-data`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Data purchase failed");
      }

      setBalance(data.data.wallet.balance);
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return { success: true, data: data.data };
    } catch (error) {
      setError(error.message);
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
   * BUY AIRTIME
   * ───────────────────────────────────────────────────────── */
  const buyAirtime = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/buy-airtime`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Airtime purchase failed");
      }

      setBalance(data.data.wallet.balance);
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return { status: true, data: data.data };
    } catch (error) {
      setError(error.message);
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
   * METER VALIDATION & RECHARGE
   * ───────────────────────────────────────────────────────── */
  const meterValidation = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/vtu/validate-meter`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.status)
        throw new Error(data.message || "Meter validation failed");
      return { status: true, data: data.result };
    } catch (error) {
      setError(error.message);
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const meterRecharge = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/vtu/recharge-meter`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.status)
        throw new Error(data.message || "Recharge failed");
      setBalance(data.data.wallet.balance);
      setTransactions((prev) => [data.data.transaction, ...prev]);
      return { status: true, data: data.data };
    } catch (error) {
      setError(error.message);
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
   * CABLE VALIDATION & RECHARGE
   * ───────────────────────────────────────────────────────── */
  const cableValidation = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/vtu/validate-cable`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.status)
        throw new Error(data.message || "Cable validation failed");
      return { status: true, data: data.result };
    } catch (error) {
      setError(error.message);
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  const cableRecharge = async (payload) => {
    if (!token) return { success: false, message: "User not authenticated" };
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/vtu/recharge-cable`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.status)
        throw new Error(data.message || "Recharge failed");
      setBalance(data.data.wallet.balance);
      setTransactions((prev) => [data.data.transaction, ...prev]);
      return { status: true, data: data.data };
    } catch (error) {
      setError(error.message);
      return { status: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  /* ─────────────────────────────────────────────────────────
   * UPGRADE TO RESELLER
   * ───────────────────────────────────────────────────────── */
  const upgradeToReseller = async () => {
    setLoading(true);
    setError(null);
    try {
      if (!token) throw new Error("Authentication required");

      const response = await fetch(`${BASE_URL}/wallet/upgrade`, {
        method: "POST",
        headers: getHeaders(),
      });

      const data = await response.json();

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Upgrade failed");
      }

      setBalance(data.data.walletBalance);

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.role = "reseller";
      localStorage.setItem("user", JSON.stringify(userData));

      return { success: true, result: data.data };
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWallet();
  }, [token, refreshWallet]);

  return (
    <WalletContext.Provider
      value={{
        /* ── Wallet state ── */
        balance,
        totalFunded,
        totalSpent,
        transactions,
        loading,
        error,

        /* ── Virtual accounts (PaymentPoint) ── */
        virtualAccounts,
        accountsLoading,

        /* ── Actions ── */
        refreshWallet,
        fundWallet,

        verifyWalletFunding,
        fetchDataPlans,
        dataPlans,
        buyData,
        buyAirtime,
        meterValidation,
        meterRecharge,
        cableValidation,
        cableRecharge,
        upgradeToReseller,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => useContext(WalletContext);
