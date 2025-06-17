import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Transfer from "./pages/Transfer";
import Bill from "./pages/Bill";
import TopUp from "./pages/TopUp";
import Invest from "./pages/Invest";
import History from "./pages/History";
import Profile from "./pages/Profile";
import { AuthContextProvider } from "./AuthContext";
import { useAuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthContext();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/bill" element={<Bill />} />
          <Route path="/top-up" element={<TopUp />} />
          <Route path="/invest" element={<Invest />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </Router>
    </AuthContextProvider>
  );
}

export default App;
