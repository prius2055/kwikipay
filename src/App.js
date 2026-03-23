import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/authContext";
import { WalletProvider } from "./context/walletContext";
import { MenuProvider } from "./context/MenuContext";
import { UserProvider } from "./context/UserContext";

import Dashboard from "./pages/Dashboard";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoutes from "./components/ProtectedRoutes";
import MarketerRoutes from "./components/MarketerRoutes";
import Confirmation from "./pages/Confirmation";
import PaymentForm from "./pages/PaymentForm";
import VerifyFunding from "./components/VerifyFunding";
import BuyData from "./pages/BuyData";
import BuyAirtime from "./pages/BuyAirtime";
import EnergyMeter from "./pages/EnergyMeter";
import CableTv from "./pages/CableTv";
import ThankYou from "./pages/ThankYou";
import ServiceManagement from "./pages/ServiceManagement";
import EditDataPlanService from "./pages/EditDataPlanService";
import TransactionService from "./pages/TransactionService";
import UserTransactions from "./pages/UserTransactions";
import ResetPassword from "./pages/ResetPassword";
import UserProfile from "./pages/Profile";
import RequestPasswordReset from "./pages/RequestPasswordRequest";
import Epins from "./pages/Epins";
import MarketerDashboard from "./pages/MarketerDashboard";
import UserList from "./pages/UserList";
import UserDetail from "./pages/UserDetail";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <WalletProvider>
          <MenuProvider>
            <UserProvider>
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
                  <Route path="/epins" element={<Epins />} />
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

                    <Route
                      path="/transactions"
                      element={<UserTransactions />}
                    />
                    <Route path="/profile" element={<UserProfile />} />

                    {/* Marketer-only Route */}
                    <Route
                      path="/marketer"
                      element={
                        <MarketerRoutes>
                          <MarketerDashboard />
                        </MarketerRoutes>
                      }
                    />
                    <Route
                      path="/marketer/data"
                      element={
                        <MarketerRoutes>
                          <ServiceManagement />
                        </MarketerRoutes>
                      }
                    />
                    <Route
                      path="/marketer/data/:id/edit"
                      element={
                        <MarketerRoutes>
                          <EditDataPlanService />
                        </MarketerRoutes>
                      }
                    />

                    <Route
                      path="/marketer/transactions"
                      element={
                        <MarketerRoutes>
                          <TransactionService />
                        </MarketerRoutes>
                      }
                    />
                    <Route
                      path="/marketer/users"
                      element={
                        <MarketerRoutes>
                          <UserList />
                        </MarketerRoutes>
                      }
                    />
                    <Route
                      path="/marketer/users/userId"
                      element={
                        <MarketerRoutes>
                          <UserDetail />
                        </MarketerRoutes>
                      }
                    />
                  </Route>
                </Routes>
              </div>
            </UserProvider>
          </MenuProvider>
        </WalletProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
