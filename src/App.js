import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./components/authContext";
import { WalletProvider } from "./components/walletContext";
import { MenuProvider } from "./components/MenuContext";

import Dashboard from "./components/Dashboard";
import Homepage from "./components/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import AdminRoute from "./components/AdminRoute";
import Confirmation from "./pages/Confirmation";
import PaymentForm from "./components/PaymentForm";
import VerifyFunding from "./components/VerifyFunding";
import BuyData from "./components/BuyData";
import BuyAirtime from "./components/BuyAirtime";
import EnergyMeter from "./components/EnergyMeter";
import CableTv from "./components/CableTv";
import ThankYou from "./components/ThankYou";
import ServiceManagement from "./pages/ServiceManagement";
import EditDataPlanService from "./pages/EditDataPlanService";
import TransactionService from "./pages/TransactionService";
import UserTransactions from "./pages/UserTransactions";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/Profile";
import RequestPasswordReset from "./pages/RequestPasswordRequest";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <MenuProvider>
            <div className="App">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Homepage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/confirmation" element={<Confirmation />} />
                <Route
                  path="/password/reset"
                  element={<RequestPasswordReset />}
                />
                <Route
                  path="/password/reset/:token"
                  element={<ResetPassword />}
                />

                {/* Protected Routes */}
                <Route element={<ProtectedRoutes />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/funding" element={<PaymentForm />} />
                  <Route path="/funding/verify" element={<VerifyFunding />} />
                  <Route path="/buy-data" element={<BuyData />} />
                  <Route path="/buy-airtime" element={<BuyAirtime />} />
                  <Route
                    path="/utilities/recharge-meter"
                    element={<EnergyMeter />}
                  />
                  <Route
                    path="/utilities/recharge-cable"
                    element={<CableTv />}
                  />
                  <Route path="/success" element={<ThankYou />} />

                  <Route path="/transactions" element={<UserTransactions />} />
                  <Route path="/profile" element={<UserProfile />} />

                  {/* Admin-only Route */}
                  <Route
                    path="/admin/data"
                    element={
                      <AdminRoute>
                        <ServiceManagement />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/data/:id/edit"
                    element={
                      <AdminRoute>
                        <EditDataPlanService />
                      </AdminRoute>
                    }
                  />
                  <Route
                    path="/admin/transactions"
                    element={
                      <AdminRoute>
                        <TransactionService />
                      </AdminRoute>
                    }
                  />
                </Route>
              </Routes>
            </div>
          </MenuProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
