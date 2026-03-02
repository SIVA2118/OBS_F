import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';
import SystemAdminRegister from './pages/SystemAdminRegister';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import StaffDashboard from './pages/StaffDashboard';
import CashierDashboard from './pages/CashierDashboard';
import BankClerkDashboard from './pages/BankClerkDashboard';

const PrivateRoute = ({ children, isStaffPage }) => {
  const { user, loading, logout } = useContext(AuthContext);
  if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-obs-blue"></div></div>;
  if (!user) return <Navigate to="/login" />;

  if (user.status === 'pending' && user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-obs-dark px-4 py-12">
        <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Account Pending</h2>
          <p className="text-slate-300 mb-8">Your application is currently under review by our team. Please check back later.</p>
          <button onClick={logout} className="inline-block bg-obs-blue hover:bg-sky-400 text-white font-medium py-3 px-8 rounded-xl transition-all">Sign Out</button>
        </div>
      </div>
    );
  }

  if (user.status === 'rejected' && user.role !== 'Admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-obs-dark px-4 py-12">
        <div className="max-w-md w-full backdrop-blur-lg bg-white/10 p-8 rounded-3xl shadow-2xl border border-white/20 text-center">
          <h2 className="text-3xl font-bold text-red-500 mb-4">Application Rejected</h2>
          <p className="text-slate-300 mb-8">Unfortunately, your account application has been rejected based on the documents provided.</p>
          <button onClick={logout} className="inline-block bg-obs-blue hover:bg-sky-400 text-white font-medium py-3 px-8 rounded-xl transition-all">Sign Out</button>
        </div>
      </div>
    );
  }

  // Route protection
  if (isStaffPage && user.role === 'Customer') {
    return <Navigate to="/dashboard" />;
  }

  // Customers cannot see admin/staff pages, but staff shouldn't see customer dashboard
  if (!isStaffPage && user.role !== 'Customer') {
    if (user.role === 'Admin') return <Navigate to="/admin" />;
    if (user.role === 'Cashier') return <Navigate to="/cashier" />;
    if (user.role === 'Bank Clerk') return <Navigate to="/clerk" />;
    return <Navigate to="/staff" />;
  }

  return children;
};

// Route director component for Login success redirect
const DashboardDirector = () => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" />;

  if (user.role === 'Customer') return <Navigate to="/dashboard" />;
  if (user.role === 'Admin') return <Navigate to="/admin" />;
  if (user.role === 'Cashier') return <Navigate to="/cashier" />;
  if (user.role === 'Bank Clerk') return <Navigate to="/clerk" />;
  return <Navigate to="/staff" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-obs-blue selection:text-white">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/system-admin/register" element={<SystemAdminRegister />} />
            <Route path="/direct" element={<DashboardDirector />} />

            <Route
              path="/dashboard"
              element={
                <PrivateRoute isStaffPage={false}>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <PrivateRoute isStaffPage={true}>
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/staff"
              element={
                <PrivateRoute isStaffPage={true}>
                  <StaffDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/cashier"
              element={
                <PrivateRoute isStaffPage={true}>
                  <CashierDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/clerk"
              element={
                <PrivateRoute isStaffPage={true}>
                  <BankClerkDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
