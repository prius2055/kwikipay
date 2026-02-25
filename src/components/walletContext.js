import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  useCallback,
  useEffect,
} from "react";

const WalletContext = createContext();

const BASE_URL = `http://localhost:5000/api/v1`;
// const BASE_URL = `https://vtu-backend-wjn6.onrender.com/api/v1`;

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [totalFunded, setTotalFunded] = useState(0);
  const [totalSpent, setTotalSpent] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [dataPlans, setDataPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const verifyingRef = useRef(false);

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

  const refreshWallet = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      // console.log("🔵 Checking authentication...");

      const response = await fetch(`${BASE_URL}/wallet/get`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.status === "success") {
        const wallet = data.data.wallet;
        // console.log("wallet balance", wallet);
        setBalance(wallet.balance);
        setTotalFunded(wallet.totalFunded);
        setTotalSpent(wallet.totalSpent);
      }
    } catch (error) {
      // console.error("❌ Auth check failed:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchDataPlans = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${BASE_URL}/vtu/data-plans`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();

      // console.log("api result", data);

      if (data.status === "success") {
        setLoading(false);

        const apiData = data.data;

        // Step 1: Group plans by service_name
        const sortedPlans = apiData.sort((a, b) => {
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
      // console.error("Error fetching data plans:", error);
      setError("Failed to fetch data plans");
    }
  }, [token, networkOrder]);

  const fundWallet = async (amount) => {
    try {
      setLoading(true);

      const res = await fetch(`${BASE_URL}/wallet/fund`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount }),
      });

      const data = await res.json();
      // console.log(data);

      if (data.status !== "success") {
        throw new Error(data.message || "Payment initialization failed");
      }

      // 🔴 Redirect user to Paystack checkout
      window.location.href = data.authorization_url;
    } catch (error) {
      // console.error("Fund wallet error:", error.message);
      setError(error.message);
    }
  };

  const verifyWalletFunding = async (reference) => {
    if (verifyingRef.current) return false; // 🚫 stop duplicates
    verifyingRef.current = true;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `${BASE_URL}/wallet/verify?reference=${reference}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);

      // console.log("balance from walletContext", data);

      setBalance(data.data.wallet.balance);
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return true;
    } catch (error) {
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const buyData = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    // console.log(payload);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/buy-data`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Data purchase failed");
      }

      // ✅ Update wallet
      setBalance(data.data.wallet.balance);

      // ✅ Update transactions
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return {
        success: true,
        data: data.data,
      };
    } catch (error) {
      setError(error.message);

      return {
        success: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const buyAirtime = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    // console.log(payload);

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/buy-airtime`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok || data.status !== "success") {
        throw new Error(data.message || "Data purchase failed");
      }

      // ✅ Update wallet
      setBalance(data.data.wallet.balance);

      // ✅ Update transactions
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return {
        status: true,
        data: data.data,
      };
    } catch (error) {
      setError(error.message);

      return {
        status: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const meterValidation = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/validate-meter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Meter validation failed");
      }

      // ✅ Update wallet
      // console.log(data.result);

      return {
        status: true,
        data: data.result,
      };
    } catch (error) {
      setError(error.message);

      return {
        status: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const meterRecharge = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/recharge-meter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // console.log(data);

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Data purchase failed");
      }

      // ✅ Update wallet
      setBalance(data.data.wallet.balance);

      // ✅ Update transactions
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return {
        status: true,
        data: data.data,
      };
    } catch (error) {
      setError(error.message);

      return {
        status: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const cableValidation = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/validate-cable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Cable validation failed");
      }

      // ✅ Update wallet
      // console.log(data.result);

      return {
        status: true,
        data: data.result,
      };
    } catch (error) {
      setError(error.message);

      return {
        status: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const cableRecharge = async (payload) => {
    if (!token) {
      return { success: false, message: "User not authenticated" };
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`${BASE_URL}/vtu/recharge-cable`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      // console.log(data);

      if (!res.ok || !data.status) {
        throw new Error(data.message || "Data purchase failed");
      }

      // ✅ Update wallet
      setBalance(data.data.wallet.balance);

      // ✅ Update transactions
      setTransactions((prev) => [data.data.transaction, ...prev]);

      return {
        status: true,
        data: data.data,
      };
    } catch (error) {
      setError(error.message);

      return {
        status: false,
        message: error.message,
      };
    } finally {
      setLoading(false);
    }
  };

  const upgradeToReseller = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${BASE_URL}/wallet/upgrade`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      // console.log("✅ Upgrade response:", data);

      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Upgrade failed");
      }

      // Update wallet state
      setBalance(data.data.walletBalance);

      // Update user role in localStorage if you store it
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      userData.role = "reseller";
      localStorage.setItem("user", JSON.stringify(userData));

      return {
        success: true,
        result: data.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
      };
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
        balance,
        totalFunded,
        totalSpent,
        transactions,
        loading,
        error,
        dataPlans,
        fetchDataPlans,
        fundWallet,
        verifyWalletFunding,
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
